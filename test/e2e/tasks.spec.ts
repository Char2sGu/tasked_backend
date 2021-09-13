import { EntityData } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/sqlite';
import { HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { AuthService } from 'src/auth/auth.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { TaskCreateInput } from 'src/tasks/dto/task-create.input';
import { TaskUpdateInput } from 'src/tasks/dto/task-update.input';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import supertest from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder('/api/tasks');

describe(url(''), () => {
  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let token: string;

  function assertEntity(entity: Task, data: EntityData<Task> = {}) {
    const { id, creator, title, description, updatedAt, createdAt, ...rest } =
      entity;
    expect(id).toBeDefined();
    expect(creator).toBeDefined();
    expect(title).toBeDefined();
    expect(description).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(rest).toEqual({});

    for (const k in data) expect(entity[k]).toEqual(data[k]);
  }

  beforeEach(async () => {
    ({ module, requester } = await prepareE2E());

    const em = module.get(EntityManager);

    const HASHED_PASSWORD = // "password"
      '$2a$10$a50UJxxNGkLOoLfuB.g6be2EKZDrYvrYWVFbpNTCkqgHi/eMA0IDm';

    const users = [
      em.create(User, {
        username: 'username1',
        password: HASHED_PASSWORD,
      }),
      em.create(User, {
        username: 'username2',
        password: HASHED_PASSWORD,
      }),
    ];
    em.persist(users);

    const classrooms = [
      em.create(Classroom, {
        name: 'classroom',
        creator: users[0],
      }),
      em.create(Classroom, {
        name: 'classroom',
        creator: users[1],
      }),
    ];
    em.persist(classrooms);

    const memberships = [
      em.create(Membership, {
        owner: users[0],
        classroom: users[0],
        role: Role.Teacher,
      }),
      em.create(Membership, {
        owner: users[1],
        classroom: users[1],
        role: Role.Teacher,
      }),
    ];
    em.persist(memberships);

    const tasks = [
      em.create(Task, {
        creator: users[0],
        title: 'title1',
      }),
      em.create(Task, {
        creator: users[1],
        title: 'title2',
      }),
      em.create(Task, {
        creator: users[1],
        title: 'title3',
      }),
    ];
    em.persist(tasks);

    const assignments = [
      em.create(Assignment, {
        recipient: users[0],
        classroom: classrooms[0],
        task: tasks[1],
      }),
    ];
    em.persist(assignments);

    await em.flush();

    token = await module.get(AuthService).obtainJwt('username1', 'password');
  });

  let response: supertest.Response;
  let createDto: TaskCreateInput;
  let updateDto: TaskUpdateInput;

  describe('/ (GET)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .get(url('/'))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the total as 2', () => {
        expect(response.body.total).toBe(2);
      });

      it('should return the task entities', () => {
        const entities: Task[] = response.body.results;
        entities.forEach((entity) => assertEntity(entity));
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

  describe('/ (POST)', () => {
    beforeEach(() => {
      createDto = {
        title: 'title',
        description: 'description',
      };
    });

    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .post(url('/'))
          .auth(token, { type: 'bearer' })
          .send({ ...createDto, extra: 123123 });
      });

      it(`should return status ${HttpStatus.CREATED}`, () => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });

      it('should return the created task entity', () => {
        assertEntity(response.body, createDto);
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

  describe('/:id/ (GET)', () => {
    describe.each`
      description   | id
      ${'own'}      | ${1}
      ${'assigned'} | ${2}
    `('Basic: $description', ({ id }) => {
      beforeEach(async () => {
        response = await requester
          .get(url(`/${id}/`))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the target task entity', () => {
        assertEntity(response.body, { id });
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.get(url('/1/'));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('Inaccessible', () => {
      beforeEach(async () => {
        response = await requester
          .get(url('/3/'))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.NOT_FOUND}`, () => {
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('/:id/ (PATCH)', () => {
    beforeEach(() => {
      updateDto = { title: 'abcdefg', description: 'some letters' };
    });

    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .patch(url('/1/'))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the updated task entity', () => {
        assertEntity(response.body, updateDto);
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.patch(url('/1/')).send(updateDto);
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    describe.each`
      description     | id   | status
      ${'assigned'}   | ${2} | ${HttpStatus.FORBIDDEN}
      ${'irrelevant'} | ${3} | ${HttpStatus.NOT_FOUND}
    `('Inaccessible', ({ id, status }) => {
      beforeEach(async () => {
        response = await requester
          .patch(url(`/${id}/`))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${status}`, () => {
        expect(response.status).toBe(status);
      });
    });
  });

  describe('/:id/ (DELETE)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .delete(url('/1/'))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.NO_CONTENT}`, () => {
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
      });
    });

    describe('Unauthorized', () => {
      beforeEach(async () => {
        response = await requester.delete(url('/1/'));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    describe.each`
      description     | id   | status
      ${'assigned'}   | ${2} | ${HttpStatus.FORBIDDEN}
      ${'irrelevant'} | ${3} | ${HttpStatus.NOT_FOUND}
    `('Inaccessible', ({ id, status }) => {
      beforeEach(async () => {
        response = await requester
          .delete(url(`/${id}/`))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${status}`, () => {
        expect(response.status).toBe(status);
      });
    });
  });
});
