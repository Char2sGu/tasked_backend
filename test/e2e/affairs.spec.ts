import { EntityManager } from '@mikro-orm/sqlite';
import { HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';
import { PREFIX } from 'src/affairs/affairs.controller';
import { CreateAffairDto } from 'src/affairs/dto/create-affair.dto';
import { UpdateAffairDto } from 'src/affairs/dto/update-affair.dto';
import { Affair } from 'src/affairs/entities/affair.entity';
import { AuthService } from 'src/auth/auth.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/role.enum';
import { User } from 'src/users/entities/user.entity';
import supertest, { Response } from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let response: Response;
  let entityManager: EntityManager;
  let users: Record<'me' | 'student' | 'else', User>;
  let tokens: Record<'own' | 'student' | 'else', string>;
  let classrooms: Record<'own' | 'unrelated', Classroom>;
  let memberships: Record<'own' | 'student' | 'unrelated', Membership>;
  let affairs: Record<'own' | 'unrelated', Affair>;
  let createDto: CreateAffairDto;
  let updateDto: UpdateAffairDto;

  function assertTransformedAffair(
    affair: Affair,
    data?: Partial<Record<keyof Affair, unknown>>,
  ) {
    const {
      id,
      classroom,
      title,
      time,
      remark,
      isActivated,
      updatedAt,
      createdAt,
      ...rest
    } = affair;

    expect(id).toBeDefined();
    expect(classroom).toBeDefined();
    expect(title).toBeDefined();
    expect(time).toBeDefined();
    expect(remark).toBeDefined();
    expect(isActivated).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(rest).toEqual({});

    if (data) for (const k in data) expect(affair[k]).toEqual(data[k]);
  }

  beforeEach(async () => {
    ({ module, requester } = await prepareE2E());
    entityManager = module.get(EntityManager);

    const HASHED_PASSWORD = // "password"
      '$2a$10$a50UJxxNGkLOoLfuB.g6be2EKZDrYvrYWVFbpNTCkqgHi/eMA0IDm';

    users = {
      me: entityManager.create(User, {
        username: 'me',
        password: HASHED_PASSWORD,
      }),
      student: entityManager.create(User, {
        username: 'member',
        password: HASHED_PASSWORD,
      }),
      else: entityManager.create(User, {
        username: 'else',
        password: HASHED_PASSWORD,
      }),
    };
    entityManager.persist(Object.values(users));

    classrooms = {
      own: entityManager.create(Classroom, {
        name: 'own',
        creator: users.me,
      }),
      unrelated: entityManager.create(Classroom, {
        name: 'unrelated',
        creator: users.else,
      }),
    };
    entityManager.persist(Object.values(classrooms));

    memberships = {
      own: entityManager.create(Membership, {
        owner: users.me,
        classroom: classrooms.own,
        role: Role.Teacher,
      }),
      student: entityManager.create(Membership, {
        owner: users.student,
        classroom: classrooms.own,
        role: Role.Student,
      }),
      unrelated: entityManager.create(Membership, {
        owner: users.else,
        classroom: classrooms.unrelated,
        role: Role.Teacher,
      }),
    };
    entityManager.persist(Object.values(memberships));

    affairs = {
      own: entityManager.create(Affair, {
        classroom: classrooms.own,
        title: 'own',
        time: dayjs(0).set('day', 1).set('hour', 3).toDate(),
      }),
      unrelated: entityManager.create(Affair, {
        classroom: classrooms.unrelated,
        title: 'unrelated',
        time: dayjs(0).set('day', 2).set('hour', 6).toDate(),
      }),
    };
    entityManager.persist(Object.values(affairs));

    await entityManager.flush();

    if (!tokens) {
      const authService = module.get(AuthService);
      tokens = {
        own: await authService.obtainJwt(users.me.username, 'password'),
        student: await authService.obtainJwt(
          users.student.username,
          'password',
        ),
        else: await authService.obtainJwt(users.else.username, 'password'),
      };
    }
  });

  describe(url('/ (GET)'), () => {
    describe.each`
      description     | token
      ${'as creator'} | ${() => tokens.own}
      ${'as student'} | ${() => tokens.student}
    `('Basic: $description', ({ token }) => {
      beforeEach(async () => {
        response = await requester
          .get(url('/'))
          .auth(token(), { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the total as 1', () => {
        expect(response.body.total).toBe(1);
      });

      it('should return own affair entities', () => {
        const affairs: Affair[] = response.body.results;
        affairs.forEach((item) =>
          assertTransformedAffair(item, { classroom: classrooms.own.id }),
        );
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.get(url('/'));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe(url('/ (POST)'), () => {
    beforeEach(() => {
      createDto = {
        classroom: classrooms.own.id,
        title: 'name',
        time: dayjs().set('day', 3).set('hour', 4).toDate(),
        remark: 'adfasdfhasdhlfajshdflkahsdfkja',
        isActivated: false,
      };
    });

    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .post(url('/'))
          .auth(tokens.own, { type: 'bearer' })
          .send(createDto);
      });

      it(`should return status ${HttpStatus.CREATED}`, () => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });

      it('should return the created affair entities', () => {
        assertTransformedAffair(response.body, {
          ...createDto,
          time: createDto.time.toISOString(),
        });
      });
    });

    describe.each`
      description           | status                    | token
      ${'not as member'}    | ${HttpStatus.BAD_REQUEST} | ${() => tokens.else}
      ${'as normal member'} | ${HttpStatus.FORBIDDEN}   | ${() => tokens.student}
    `('Not Allowed: $description', ({ status, token }) => {
      beforeEach(async () => {
        response = await requester
          .post(url('/'))
          .auth(token(), { type: 'bearer' })
          .send(createDto);
      });

      it(`should return status ${status}`, () => {
        expect(response.status).toBe(status);
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.post(url('/')).send(createDto);
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe(url('/:id/ (GET)'), () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .get(url(`/${affairs.own.id}/`))
          .auth(tokens.own, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the target affair entity', () => {
        assertTransformedAffair(response.body, {
          id: affairs.own.id,
        });
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.get(url(`/${affairs.own.id}/`));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe(url('/:id/ (PATCH)'), () => {
    beforeEach(() => {
      updateDto = { title: 'new' };
    });

    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .patch(url(`/${affairs.own.id}/`))
          .auth(tokens.own, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the updated affair entities', () => {
        assertTransformedAffair(response.body, updateDto);
      });
    });

    describe.each`
      description           | status                  | token
      ${'not as member'}    | ${HttpStatus.NOT_FOUND} | ${() => tokens.else}
      ${'as normal member'} | ${HttpStatus.FORBIDDEN} | ${() => tokens.student}
    `('Not Allowed: $description', ({ status, token }) => {
      beforeEach(async () => {
        response = await requester
          .patch(url(`/${affairs.own.id}/`))
          .auth(token(), { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${status}`, () => {
        expect(response.status).toBe(status);
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester
          .patch(url(`/${affairs.own.id}/`))
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe(url('/:id/ (DELETE)'), () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .delete(url(`/${affairs.own.id}/`))
          .auth(tokens.own, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.NO_CONTENT}`, () => {
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
      });

      it('should return nothing', () => {
        expect(response.body).toEqual({});
      });
    });

    describe.each`
      description           | status                  | token
      ${'not as member'}    | ${HttpStatus.NOT_FOUND} | ${() => tokens.else}
      ${'as normal member'} | ${HttpStatus.FORBIDDEN} | ${() => tokens.student}
    `('Not Allowed: $description', ({ status, token }) => {
      beforeEach(async () => {
        response = await requester
          .delete(url(`/${affairs.own.id}/`))
          .auth(token(), { type: 'bearer' });
      });

      it(`should return status ${status}`, () => {
        expect(response.status).toBe(status);
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.delete(url(`/${affairs.own.id}/`));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});