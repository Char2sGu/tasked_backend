import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ClientError, GraphQLClient } from 'graphql-request';
import { AuthResult } from 'src/auth/dto/auth-result.dto';
import { TOKEN_LENGTH } from 'src/constants';
import { User } from 'src/users/entities/user.entity';
import { prepareE2E } from 'test/utils';

describe('Auth', () => {
  let app: INestApplication;
  let module: TestingModule;
  let client: GraphQLClient;
  let repository: EntityRepository<User>;

  beforeEach(async () => {
    ({ app, module, client } = await prepareE2E());
    repository = module.get<EntityRepository<User>>(getRepositoryToken(User));

    repository.persist(
      repository.create({
        username: 'username1',
        password: 'password1',
      }),
    );
    await repository.flush();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('obtainToken', () => {
    let token: string;

    it('should return the token with legal arguments', async () => {
      await request('username1', 'password1');
      expect(token).toHaveLength(TOKEN_LENGTH);
    });

    it('should throws an error with illegal arguments', async () => {
      await expect(request('', '')).rejects.toThrowError(ClientError);
    });

    async function request(username: string, password: string) {
      const result = await client.request<{ obtainToken: AuthResult }>(
        `mutation { obtainToken(username: "${username}", password: "${password}") { token } }`,
      );
      token = result.obtainToken.token;
    }
  });
});
