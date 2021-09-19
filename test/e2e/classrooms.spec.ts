import { EntityData } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/sqlite';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { PaginatedClassrooms } from 'src/classrooms/dto/paginated-classrooms.dto';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { User } from 'src/users/entities/user.entity';

import { GraphQLClient } from './utils/graphql-client.class';
import { prepareE2E } from './utils/prepare-e2e';

describe.only('Classrooms', () => {
  let app: INestApplication;
  let module: TestingModule;
  let client: GraphQLClient;
  let em: EntityManager;

  beforeEach(async () => {
    ({ app, module, client } = await prepareE2E());
    em = module.get(EntityManager);
  });

  beforeEach(async () => {
    await em
      .persist([
        em.create(User, {
          username: 'username',
          password: 'password',
        }),
      ])
      .flush();

    const token = await module
      .get(AuthService)
      .obtainJwt('username', 'password');

    client.setToken(token);
  });

  describe('classroom', () => {
    let result: EntityData<Classroom>;

    beforeEach(async () => {
      await em.persist([create(1)]).flush();
    });

    it('should return the data', async () => {
      await request('(id: 1)');
      expect(result).toEqual({ id: '1', name: 'name', deletedAt: null });
    });

    it.each`
      args
      ${'(id: 999)'}
      ${'(id: 0)'}
    `('should return an error when the target not found', async ({ args }) => {
      await expect(request(args)).rejects.toThrow('Not Found');
    });

    it('should return an error when not authenticated', async () => {
      client.setToken();
      await expect(request('(id: 1)')).rejects.toThrow('Unauthorized');
    });

    async function request(args?: string) {
      const content = await client.request(
        `query { classroom${args} { id, name, deletedAt } }`,
      );
      result = content.classroom;
    }
  });

  describe('classrooms', () => {
    beforeEach(async () => {
      await em.persist([create(1), create(1), create(1)]).flush();
    });

    let result: PaginatedClassrooms;

    it('should return the data when no arguments are specified', async () => {
      await request();
      expect(result).toEqual({
        total: 3,
        results: [{ id: '1' }, { id: '2' }, { id: '3' }],
      });
    });

    it('should return an error when not authenticated', async () => {
      client.setToken();
      await expect(request()).rejects.toThrow('Unauthorized');
    });

    it.each`
      args
      ${'(limit: 1, offset: 1)'}
    `('should the data when arguments are $args', async ({ args }) => {
      await request(args);
      expect(result).toEqual({ total: 3, results: [{ id: '2' }] });
    });

    async function request(args = '') {
      const content = await client.request(
        `query { classrooms${args} { total, results { id } } }`,
      );
      result = content.classrooms;
    }
  });

  describe('createClassroom', () => {
    let result: Classroom;

    it('should return the data', async () => {
      await request('(data: { name: "name" })');
      expect(result).toEqual({ id: '1', name: 'name' });
    });

    it('should return an error when not authenticated', async () => {
      client.setToken();
      const promise = request('(data: { name: "name" })');
      await expect(promise).rejects.toThrow('Unauthorized');
    });

    it.each`
      data              | msg
      ${'{}'}           | ${'Field '}
      ${'{ name: "" }'} | ${'Bad Request'}
    `(
      'should return an error when the data $data is not valid',
      async ({ data, msg }) => {
        const promise = request(`(data: ${data})`);
        await expect(promise).rejects.toThrow(msg);
      },
    );

    async function request(args: string) {
      const content = await client.request(
        `mutation { createClassroom${args} { id, name } }`,
      );
      result = content.createClassroom;
      return result;
    }
  });

  describe('updateClassroom', () => {
    let result: Classroom;

    beforeEach(async () => {
      await em.persist(create(1)).flush();
    });

    it('should return the data', async () => {
      await request('(id: 1, data: { name: "new-name" })', '{ name }');
      expect(result).toEqual({ name: 'new-name' });
    });

    it('should return an error when not authenticated', async () => {
      client.setToken();
      const promise = request('(id: 1, data: {})', '{ id }');
      await expect(promise).rejects.toThrow('Unauthorized');
    });

    it.each`
      data
      ${'{ name: "" }'}
    `(
      'should return an error when data $data is not valid',
      async ({ data }) => {
        const promise = request(`(id: 1, data: ${data})`, '{ id }');
        await expect(promise).rejects.toThrow('Bad Request');
      },
    );

    it('should return an error when not authorized', async () => {
      await em.persist(create(2)).flush();
      const promise = request(`(id: 2, data: {})`, `{ id }`);
      await expect(promise).rejects.toThrow(
        'Only the creator can update the classroom',
      );
    });

    async function request(args: string, fields: string) {
      const content = await client.request(
        `mutation { updateClassroom${args} ${fields} }`,
      );
      result = content.updateClassroom;
    }
  });

  describe('deleteClassroom', () => {
    let result: Classroom;

    beforeEach(async () => {
      await em.persist(create(1)).flush();
    });

    it('should return the data', async () => {
      await request(`(id: 1)`, `{ id }`);
      expect(result).toEqual({ id: '1' });
      const count = await em.count(Classroom);
      expect(count).toBe(0);
    });

    it('should return an error when not authenticated', async () => {
      client.setToken();
      const promise = request(`(id: 1)`, `{ id }`);
      await expect(promise).rejects.toThrow('Unauthorized');
    });

    it('should return an error when not authorized', async () => {
      await em.persist(create(2)).flush();
      const promise = request(`(id: 2)`, `{ id }`);
      await expect(promise).rejects.toThrow(
        'Only the creator can destroy the classroom',
      );
    });

    async function request(args: string, fields: string) {
      const content = await client.request(
        `mutation { deleteClassroom${args} ${fields} }`,
      );
      result = content.deleteClassroom;
    }
  });

  afterEach(async () => {
    await app.close();
  });

  function create(creator: unknown) {
    return em.create(Classroom, {
      name: 'name',
      creator,
      memberships: [
        {
          owner: 1,
          role: Role.Teacher,
        } as EntityData<Membership>,
      ],
    });
  }
});
