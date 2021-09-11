import { EntityData } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/sqlite';
import { TestingModule } from '@nestjs/testing';
import { AssignmentCreateInput } from 'src/assignments/dto/assignment-create.input';
import { AssignmentUpdateInput } from 'src/assignments/dto/assignment-update.input';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { AuthService } from 'src/auth/auth.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/role.enum';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import supertest from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder('/api/assignments');

describe(url(''), () => {
  const HASHED_PASSWORD = // "password"
    '$2a$10$a50UJxxNGkLOoLfuB.g6be2EKZDrYvrYWVFbpNTCkqgHi/eMA0IDm';

  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let em: EntityManager;
  let authService: AuthService;
  let token: string;

  beforeEach(async () => {
    ({ module, requester } = await prepareE2E());
    em = module.get(EntityManager);
    authService = module.get(AuthService);

    await em
      .persist([
        em.create(User, {
          username: '1',
          password: HASHED_PASSWORD,
        }),
      ])
      .flush();

    token = await authService.obtainJwt('1', 'password');
  });

  let response: supertest.Response;
  let createDto: AssignmentCreateInput;
  let updateDto: AssignmentUpdateInput;

  function assertEntity(entity: Assignment, data: EntityData<Assignment> = {}) {
    const {
      id,
      recipient,
      classroom,
      task,
      isPublic,
      isCompleted,
      updatedAt,
      createdAt,
      ...rest
    } = entity;

    expect(id).toBeDefined();
    expect(recipient).toBeDefined();
    expect(classroom).toBeDefined();
    expect(task).toBeDefined();
    expect(isPublic).toBeDefined();
    expect(isCompleted).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(rest).toEqual({});

    for (const k in data) expect(entity[k]).toBe(data[k]);
  }

  describe('/ (GET)', () => {
    describe('Own', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Assignment, {
              recipient: 1,
              classroom: 1,
              task: 1,
            }),
            em.create(Assignment, {
              recipient: 2,
              classroom: 1,
              task: 1,
            }),
          ])
          .flush();

        response = await requester
          .get(url('/'))
          .auth(token, { type: 'bearer' });
      });

      it('should return status 200', () => {
        expect(response.status).toBe(200);
      });

      it('should return the total as 1', () => {
        expect(response.body.total).toBe(1);
      });

      it('should return the expected entities', () => {
        const entities: Assignment[] = response.body.results;
        entities.forEach((entity) => {
          assertEntity(entity, { recipient: 1 });
        });
      });
    });

    describe('Own Task', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Task, {
              creator: 1,
              title: '1',
            }),
            em.create(Task, {
              creator: 2,
              title: '2',
            }),
            em.create(Assignment, {
              recipient: 3,
              classroom: 1,
              task: 1,
            }),
            em.create(Assignment, {
              recipient: 3,
              classroom: 1,
              task: 2,
            }),
          ])
          .flush();

        response = await requester
          .get(url('/'))
          .auth(token, { type: 'bearer' });
      });

      it('should return status 200', () => {
        expect(response.status).toBe(200);
      });

      it('should return the expected entities', () => {
        const entities: Assignment[] = response.body.results;
        entities.forEach((assignment) => {
          assertEntity(assignment, { task: 1 });
        });
      });
    });

    describe('Public', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Membership, {
              owner: 1,
              classroom: 1,
              role: Role.Student,
            }),
            em.create(Assignment, {
              recipient: 2,
              classroom: 1,
              isPublic: true,
            }),
            em.create(Assignment, {
              recipient: 2,
              classroom: 1,
              isPublic: false,
            }),
          ])
          .flush();

        response = await requester
          .get(url('/'))
          .auth(token, { type: 'bearer' });
      });

      it('should return status 200', () => {
        expect(response.status).toBe(200);
      });

      it('should return the expected entities', () => {
        const entities: Assignment[] = response.body.results;
        entities.forEach((entity) => {
          assertEntity(entity, { isPublic: 1, classroom: 1 });
        });
      });
    });

    describe('UnAuthorized', () => {
      beforeEach(async () => {
        response = await requester.get(url('/'));
      });

      it('should return status 401', () => {
        expect(response.status).toBe(401);
      });
    });
  });

  describe('/ (POST)', () => {
    describe.each`
      roleFrom        | roleTo
      ${'creator'}    | ${Role.Student}
      ${Role.Teacher} | ${Role.Student}
    `('Inferior：$roleFrom -> $roleTo', ({ roleFrom, roleTo }) => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Classroom, {
              creator: roleFrom == 'creator' ? 1 : 3,
              name: '1',
            }),
            em.create(Task, {
              creator: 1,
              title: 1,
            }),
            em.create(Membership, {
              owner: 1,
              classroom: 1,
              role: roleFrom == 'creator' ? Role.Teacher : roleFrom,
            }),
            em.create(Membership, {
              owner: 2,
              classroom: 1,
              role: roleTo,
            }),
          ])
          .flush();

        createDto = { recipient: 2, classroom: 1, task: 1 };

        response = await requester
          .post(url('/'))
          .auth(token, { type: 'bearer' })
          .send(createDto);
      });

      it('should return status 201', () => {
        expect(response.status).toBe(201);
      });

      it('should return the entity', () => {
        assertEntity(response.body, createDto);
      });
    });

    describe.each`
      roleFrom        | roleTo
      ${Role.Student} | ${'creator'}
      ${Role.Teacher} | ${'creator'}
      ${Role.Student} | ${Role.Teacher}
      ${Role.Student} | ${Role.Student}
    `('Not Inferior: $roleFrom -> $roleTo', ({ roleFrom, roleTo }) => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Classroom, {
              name: '1',
              creator: roleTo == 'creator' ? 2 : 3,
            }),
            em.create(Membership, {
              owner: 1,
              classroom: 1,
              role: roleFrom,
            }),
            em.create(Membership, {
              owner: 2,
              classroom: 1,
              role: roleTo == 'creator' ? Role.Teacher : roleTo,
            }),
            em.create(Task, {
              creator: 1,
              title: '1',
            }),
          ])
          .flush();

        createDto = { classroom: 1, recipient: 2, task: 1 };

        response = await requester
          .post(url('/'))
          .auth(token, { type: 'bearer' })
          .send(createDto);
      });

      it('should return status 400', () => {
        expect(response.status).toBe(400);
      });
    });

    describe('Not Own Task', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Classroom, {
              creator: 1,
              name: '1',
            }),
            em.create(Membership, {
              owner: 1,
              classroom: 1,
              role: Role.Teacher,
            }),
            em.create(Membership, {
              owner: 2,
              classroom: 1,
              role: Role.Student,
            }),
            em.create(Task, {
              creator: 3,
              title: '1',
            }),
          ])
          .flush();

        createDto = { classroom: 1, recipient: 2, task: 1 };

        response = await requester
          .post(url('/'))
          .auth(token, { type: 'bearer' })
          .send(createDto);
      });

      it('should return status 400', () => {
        expect(response.status).toBe(400);
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.post(url('/'));
      });

      it('should return status 401', () => {
        expect(response.status).toBe(401);
      });
    });
  });

  describe('/:id/ (GET)', () => {
    describe('Common', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Assignment, {
              recipient: 1,
              classroom: 1,
              task: 1,
            }),
          ])
          .flush();

        response = await requester
          .get(url('/1/'))
          .auth(token, { type: 'bearer' });
      });

      it('should return status 200', () => {
        expect(response.status).toBe(200);
      });

      it('should return the entity', () => {
        assertEntity(response.body, { id: 1 });
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.get(url('/'));
      });

      it('should return status 401', () => {
        expect(response.status).toBe(401);
      });
    });
  });

  describe('/:id/ (PATCH)', () => {
    describe('Assigned', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Assignment, {
              classroom: 1,
              recipient: 2,
              task: 1,
            }),
            em.create(Task, {
              creator: 1,
              title: '1',
            }),
          ])
          .flush();

        updateDto = { isPublic: true };

        response = await requester
          .patch(url('/1/'))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it('should return status 200', () => {
        expect(response.status).toBe(200);
      });

      it('should return the entity', () => {
        assertEntity(response.body, updateDto);
      });
    });

    describe('Received', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Assignment, {
              recipient: 1,
              classroom: 1,
              task: 1,
            }),
            em.create(Task, {
              creator: 2,
              title: '1',
            }),
          ])
          .flush();

        updateDto = { isPublic: true };

        response = await requester
          .patch(url('/1/'))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it('should return status 403', () => {
        expect(response.status).toBe(403);
      });
    });

    describe('Public', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Assignment, {
              recipient: 2,
              classroom: 1,
              task: 1,
              isPublic: true,
            }),
            em.create(Classroom, {
              creator: 1,
              name: '1',
            }),
            em.create(Membership, {
              owner: 1,
              classroom: 1,
              role: Role.Teacher,
            }),
            em.create(Membership, {
              owner: 2,
              classroom: 1,
              role: Role.Student,
            }),
            em.create(Task, {
              creator: 3,
              title: '1',
            }),
          ])
          .flush();

        updateDto = { isPublic: false };

        response = await requester
          .patch(url('/1/'))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it('should return status 403', () => {
        expect(response.status).toBe(403);
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.patch(url('/1/'));
      });

      it('should return status 401', () => {
        expect(response.status).toBe(401);
      });
    });
  });

  describe('/:id/ (DELETE)', () => {
    describe('Received', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Assignment, {
              recipient: 1,
              classroom: 1,
              task: 1,
            }),
            em.create(Task, {
              creator: 2,
              title: '',
            }),
          ])
          .flush();

        response = await requester
          .delete(url('/1/'))
          .auth(token, { type: 'bearer' });
      });

      it('should return status 403', () => {
        expect(response.status).toBe(403);
      });
    });

    describe('Assigned', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Assignment, {
              recipient: 2,
              classroom: 1,
              task: 1,
            }),
            em.create(Task, {
              creator: 1,
              title: '',
            }),
          ])
          .flush();

        response = await requester
          .delete(url('/1/'))
          .auth(token, { type: 'bearer' });
      });

      it('should return status 204', () => {
        expect(response.status).toBe(204);
      });

      it('should return nothing', () => {
        expect(response.body).toEqual({});
      });
    });

    describe('Public', () => {
      beforeEach(async () => {
        await em
          .persist([
            em.create(Assignment, {
              recipient: 2,
              classroom: 1,
              task: 1,
              isPublic: true,
            }),
            em.create(Task, {
              creator: 3,
              title: '',
            }),
            em.create(Classroom, {
              creator: 1,
              name: '1',
            }),
            em.create(Membership, {
              owner: 1,
              classroom: 1,
              role: Role.Teacher,
            }),
            em.create(Membership, {
              owner: 2,
              classroom: 1,
              role: Role.Student,
            }),
          ])
          .flush();

        response = await requester
          .delete(url('/1/'))
          .auth(token, { type: 'bearer' });
      });

      it('should return status 403', () => {
        expect(response.status).toBe(403);
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.delete(url('/1/'));
      });

      it('should return status 401', () => {
        expect(response.status).toBe(401);
      });
    });
  });
});
