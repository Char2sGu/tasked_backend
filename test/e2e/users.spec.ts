import { EntityRepository } from '@mikro-orm/core';
import { NonFunctionPropertyNames } from '@mikro-orm/core/typings';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ClientError, GraphQLClient } from 'graphql-request';
import { AuthService } from 'src/auth/auth.service';
import { UsersPaginated } from 'src/users/dto/users-paginated.dto';
import { User } from 'src/users/entities/user.entity';
import { prepareE2E } from 'test/utils';

describe('Users', () => {
  let app: INestApplication;
  let module: TestingModule;
  let client: GraphQLClient;
  let repo: EntityRepository<User>;
  let token: string;

  beforeEach(async () => {
    ({ app, module, client } = await prepareE2E());
    repo = module.get(getRepositoryToken(User));

    await repo
      .persist([
        repo.create({
          username: 'username',
          password: 'password',
        }),
      ])
      .flush();

    token = await module.get(AuthService).obtainJwt('username', 'password');
    client.setHeader('authorization', `Bearer ${token}`);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('queryUser', () => {
    const fields: NonFunctionPropertyNames<User>[] = [
      'id',
      'username',
      'nickname',
      'gender',
      'createdAt',
      'updatedAt',
    ];

    let user: User;

    it('should return the data', async () => {
      await request();
      fields.forEach((field) => {
        expect(user[field]).toBeDefined();
      });
    });

    it('should return an error when not authorized', async () => {
      removeToken();
      await expect(request()).rejects.toThrowError(ClientError);
    });

    async function request(id = 1) {
      const result = await client.request<{ user: User }>(
        `query { user(id: ${id}) { ${fields.join(', ')} } }`,
      );
      user = result.user;
    }
  });

  describe('queryUsers', () => {
    let users: UsersPaginated;

    it('should return the paginated users when no arguments are provided', async () => {
      await request('');
      expect(users.total).toBe(1);
      expect(users.results).toBeInstanceOf(Array);
      expect(users.results).toHaveLength(1);
    });

    it('should return an error when not authorized', async () => {
      removeToken();
      await expect(request('')).rejects.toThrowError(ClientError);
    });

    it('should return the requested range when limit and offset are specified', async () => {
      await insert(2);
      await request('(limit: 1, offset: 1)');
      expect(users.results).toHaveLength(1);
      expect(users.results[0].id).toBe('2');
    });

    async function request(args: string) {
      const result = await client.request<{ users: UsersPaginated }>(
        `query { users${args} { total, results { id } } }`,
      );
      users = result.users;
    }
  });

  describe('queryCurrent', () => {
    let user: User;

    it('should return the current user', async () => {
      await request();
      expect(user.id).toBe('1');
    });

    it('should return an error when not authorized', async () => {
      removeToken();
      await expect(request()).rejects.toThrowError(ClientError);
    });

    async function request() {
      const result = await client.request<{ current: User }>(
        `query { current { id } }`,
      );
      user = result.current;
    }
  });

  describe('createUser', () => {
    let user: User;

    it('should return the created user', async () => {
      await request();
      expect(user).toBeDefined();
      expect(user.username).toBe('username_');
    });

    it.each`
      desc                    | args
      ${'duplicate username'} | ${'{ username: "username" }'}
    `(
      'should return an error when data is not valid: $desc',
      async ({ data }) => {
        const args = `(data: ${data})`;
        await expect(request(args)).rejects.toThrowError(ClientError);
      },
    );

    async function request(
      args = '(data: { username: "username_", password: "password" })',
    ) {
      const result = await client.request<{ createUser: User }>(
        `mutation { createUser${args} { username } }`,
      );
      user = result.createUser;
    }
  });

  describe('updateUser', () => {
    let user: User;

    it('should return the updated user', async () => {
      await request(
        '(id: 1, data: { nickname: "new-nickname" })',
        '{ nickname }',
      );
      expect(user.nickname).toBe('new-nickname');
    });

    it('should return an error when not authorized', async () => {
      removeToken();
      await expect(request('(id: 1, data: {})', '{ id }')).rejects.toThrowError(
        ClientError,
      );
    });

    async function request(args: string, fields: string) {
      const result = await client.request<{ updateUser: User }>(
        `mutation { updateUser${args} ${fields} }`,
      );
      user = result.updateUser;
    }
  });

  async function insert(count = 1) {
    for (let i = 1; i <= count; i++)
      repo.persist(
        repo.create({ username: `username${i}`, password: 'password' }),
      );
    await repo.flush();
  }

  function removeToken() {
    client.setHeader('authorization', '');
  }
});
