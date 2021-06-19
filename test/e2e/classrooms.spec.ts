import { EntityManager } from '@mikro-orm/sqlite';
import { HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { PREFIX } from 'src/classrooms/classrooms.controller';
import { CreateClassroomDto } from 'src/classrooms/dto/create-classroom.dto';
import { UpdateClassroomDto } from 'src/classrooms/dto/update-classroom.dto';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { ApplicationStatus } from 'src/join-applications/application-status.enum';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/role.enum';
import { User } from 'src/users/entities/user.entity';
import supertest, { Response } from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let entityManager: EntityManager;
  let tokens: Record<'creator' | 'someone', string>;
  let response: Response;
  let users: Record<'creator' | 'someone', User>;
  let classrooms: Classroom[];
  let memberships: Membership[];
  let applications: JoinApplication[];
  let createDto: CreateClassroomDto;
  let updateDto: UpdateClassroomDto;

  function assertSerializedClassroom(
    classroom: Classroom,
    data: Partial<Record<keyof Classroom, unknown>> = {},
  ) {
    const {
      id,
      name,
      creator,
      joinApplications,
      memberships,
      sheduleItems,
      updatedAt,
      createdAt,
      ...rest
    } = classroom;

    expect(id).toBeDefined();
    expect(name).toBeDefined();
    expect(creator).toBeDefined();
    expect(joinApplications).toBeDefined();
    expect(memberships).toBeDefined();
    expect(sheduleItems).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(rest).toEqual({});

    for (const k in data) expect(classroom[k]).toBe(data[k]);
  }

  beforeEach(async () => {
    ({ module, requester } = await prepareE2E());

    entityManager = module.get(EntityManager);

    const HASHED_PASSWORD = // "password"
      '$2a$10$a50UJxxNGkLOoLfuB.g6be2EKZDrYvrYWVFbpNTCkqgHi/eMA0IDm';

    users = {
      creator: entityManager.create(User, {
        username: 'creator',
        password: HASHED_PASSWORD,
      }),
      someone: entityManager.create(User, {
        username: 'someone',
        password: HASHED_PASSWORD,
      }),
    };
    entityManager.persist(Object.values(users));

    classrooms = [
      entityManager.create(Classroom, {
        name: 'classroom',
        creator: users.creator,
      }),
      entityManager.create(Classroom, {
        name: 'classroom',
        creator: users.someone,
      }),
    ];
    entityManager.persist(classrooms);

    memberships = [
      entityManager.create(Membership, {
        owner: users.creator,
        classroom: classrooms[0],
        role: Role.Teacher,
      }),
      entityManager.create(Membership, {
        owner: users.someone,
        classroom: classrooms[0],
        role: Role.Teacher,
      }),
      entityManager.create(Membership, {
        owner: users.someone,
        classroom: classrooms[1],
        role: Role.Teacher,
      }),
    ];
    entityManager.persist(memberships);

    applications = [
      entityManager.create(JoinApplication, {
        owner: users.creator,
        classroom: classrooms[0],
        role: Role.Student,
        status: ApplicationStatus.Pending,
      }),
      entityManager.create(JoinApplication, {
        owner: users.someone,
        classroom: classrooms[1],
        role: Role.Student,
        status: ApplicationStatus.Pending,
      }),
    ];
    entityManager.persist(applications);

    await entityManager.flush();

    if (!tokens) {
      const authService = module.get(AuthService);
      tokens = {
        creator: await authService.obtainJwt('creator', 'password'),
        someone: await authService.obtainJwt('someone', 'password'),
      };
    }
  });

  describe('/ (GET)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .get(url('/'))
          .auth(tokens.creator, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the total as 1', () => {
        expect(response.body.total).toBe(1);
      });

      it('should return the classroom entities created by the user', () => {
        const classrooms: Classroom[] = response.body.results;
        classrooms.forEach((classroom) =>
          assertSerializedClassroom(classroom, { creator: users.creator.id }),
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

  describe('/ (POST)', () => {
    describe('Basic', () => {
      beforeEach(() => {
        createDto = { name: 'name' };
      });

      beforeEach(async () => {
        response = await requester
          .post(url('/'))
          .auth(tokens.creator, { type: 'bearer' })
          .send(createDto);
      });

      it(`should return status ${HttpStatus.CREATED}`, () => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });

      it('should return the created classroom entity', () => {
        assertSerializedClassroom(response.body, { creator: users.creator.id });
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

  describe('/:id/ (GET)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .get(url(`/${classrooms[0].id}/`))
          .auth(tokens.creator, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the classroom entity', () => {
        assertSerializedClassroom(response.body, { id: classrooms[0].id });
      });
    });

    describe('Soft Deleted', () => {
      beforeEach(async () => {
        const entity = entityManager.create(Classroom, {
          name: 'soft-deleted',
          creator: users.creator,
          deletedAt: new Date(),
        });
        await entityManager.persistAndFlush(entity);

        response = await requester
          .get(url(`/${entity.id}/`))
          .auth(tokens.creator, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.NOT_FOUND}`, () => {
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.get(url(`/${classrooms[0].id}/`));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/:id/ (PATCH)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        updateDto = { name: 'updated' };
        response = await requester
          .patch(url(`/${classrooms[0].id}/`))
          .auth(tokens.creator, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the updated classroom entity', () => {
        assertSerializedClassroom(response.body, {
          id: classrooms[0].id,
          ...updateDto,
        });
      });
    });

    describe('Forbidden: not the creator', () => {
      beforeEach(async () => {
        response = await requester
          .patch(url(`/${classrooms[0].id}/`))
          .auth(tokens.someone, { type: 'bearer' })
          .send({});
      });

      it(`should return status ${HttpStatus.FORBIDDEN}`, () => {
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.patch(url('/1/')).send({});
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/:id/ (DELETE)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .delete(url(`/${classrooms[0].id}/`))
          .auth(tokens.creator, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.NO_CONTENT}`, () => {
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
      });

      it('should return nothing', () => {
        expect(response.body).toEqual({});
      });

      it('should soft-delete the entity', async () => {
        const entity = await entityManager.findOne(Classroom, classrooms[0].id);
        expect(entity).toBeNull();
      });
    });

    describe('Forbidden: not the creator', () => {
      beforeEach(async () => {
        response = await requester
          .delete(url(`/${classrooms[0].id}/`))
          .auth(tokens.someone, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.FORBIDDEN}`, () => {
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.delete(url(`/${classrooms[0].id}/`));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
