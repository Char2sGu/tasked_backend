import { EntityManager } from '@mikro-orm/sqlite';
import { HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';
import { AuthService } from 'src/auth/auth.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/role.enum';
import { CreateSheduleItemDto } from 'src/shedule-items/dto/create-shedule-item.dto';
import { UpdateSheduleItemDto } from 'src/shedule-items/dto/update-shedule-item.dto';
import { SheduleItem } from 'src/shedule-items/entities/shedule-item.entity';
import { PREFIX } from 'src/shedule-items/shedule-items.controller';
import { User } from 'src/users/entities/user.entity';
import supertest, { Response } from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let response: Response;
  let entityManager: EntityManager;
  let users: Record<'me' | 'else', User>;
  let token: string;
  let classrooms: Record<'own' | 'unrelated', Classroom>;
  let memberships: Record<'own' | 'unrelated', Membership>;
  let sheduleItems: Record<'own' | 'unrelated', SheduleItem>;
  let createDto: CreateSheduleItemDto;
  let updateDto: UpdateSheduleItemDto;

  function assertTransformedSheduleItem(
    sheduleItem: SheduleItem,
    data?: Partial<Record<keyof SheduleItem, unknown>>,
  ) {
    const {
      id,
      classroom,
      name,
      time,
      remark,
      updatedAt,
      createdAt,
      ...rest
    } = sheduleItem;

    expect(id).toBeDefined();
    expect(classroom).toBeDefined();
    expect(name).toBeDefined();
    expect(time).toBeDefined();
    expect(remark).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(rest).toEqual({});

    if (data) for (const k in data) expect(sheduleItem[k]).toEqual(data[k]);
  }

  beforeEach(async () => {
    ({ module, requester } = await prepareE2E());
    entityManager = module.get(EntityManager);

    users = {
      me: entityManager.create(User, {
        username: 'me',
        password: 'password',
      }),
      else: entityManager.create(User, {
        username: 'else',
        password: 'password',
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
      unrelated: entityManager.create(Membership, {
        owner: users.else,
        classroom: classrooms.unrelated,
        role: Role.Teacher,
      }),
    };
    entityManager.persist(Object.values(memberships));

    sheduleItems = {
      own: entityManager.create(SheduleItem, {
        classroom: classrooms.own,
        name: 'own',
        time: dayjs(0).set('day', 1).set('hour', 3).toDate(),
      }),
      unrelated: entityManager.create(SheduleItem, {
        classroom: classrooms.unrelated,
        name: 'unrelated',
        time: dayjs(0).set('day', 2).set('hour', 6).toDate(),
      }),
    };
    entityManager.persist(Object.values(sheduleItems));

    await entityManager.flush();

    token = await module
      .get(AuthService)
      .obtainJwt(users.me.username, 'password');
  });

  describe(url('/ (GET)'), () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .get(url('/'))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the total as 1', () => {
        expect(response.body.total).toBe(1);
      });

      it('should return own shedule item entities', () => {
        const sheduleItems: SheduleItem[] = response.body.results;
        sheduleItems.forEach((item) =>
          assertTransformedSheduleItem(item, { classroom: classrooms.own.id }),
        );
      });
    });

    describe('Not Authed', () => {
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
        name: 'name',
        time: dayjs().set('day', 3).set('hour', 4).toISOString(),
      };
    });

    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .post(url('/'))
          .auth(token, { type: 'bearer' })
          .send(createDto);
      });

      it(`should return status ${HttpStatus.CREATED}`, () => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });

      it('should return the created shedule item entities', () => {
        assertTransformedSheduleItem(response.body, createDto);
      });
    });

    describe('Not Authed', () => {
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
          .get(url(`/${sheduleItems.own.id}/`))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the target shedule item entity', () => {
        assertTransformedSheduleItem(response.body, {
          id: sheduleItems.own.id,
        });
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.get(url(`/${sheduleItems.own.id}/`));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe(url('/:id/ (PATCH)'), () => {
    beforeEach(() => {
      updateDto = { name: 'new' };
    });

    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .patch(url(`/${sheduleItems.own.id}/`))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the updated shedule item entities', () => {
        assertTransformedSheduleItem(response.body, updateDto);
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester
          .patch(url(`/${sheduleItems.own.id}/`))
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
          .delete(url(`/${sheduleItems.own.id}/`))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.NO_CONTENT}`, () => {
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
      });

      it('should return nothing', () => {
        expect(response.body).toEqual({});
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.delete(url(`/${sheduleItems.own.id}/`));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
