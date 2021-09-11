import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import { AuthArgs } from 'src/auth/dto/auth.args';
import { AuthResult } from 'src/auth/dto/auth-result.dto';
import { TOKEN_LENGTH } from 'src/constants';
import { User } from 'src/users/entities/user.entity';
import supertest, { Response } from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder('/api/auth');

describe(url(''), () => {
  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let repository: EntityRepository<User>;
  let response: Response;
  let authInfo: AuthResult;

  beforeEach(async () => {
    ({ module, requester } = await prepareE2E());
    repository = module.get<EntityRepository<User>>(getRepositoryToken(User));

    repository.persist(
      repository.create({
        username: 'username1',
        password: 'password1',
      }),
    );
    await repository.flush();
  });

  describe('/ (PUT)', () => {
    describe('Legal Data', () => {
      beforeEach(async () => {
        const data: AuthArgs = {
          username: 'username1',
          password: 'password1',
        };
        response = await requester.put(url('/')).send(data);
        authInfo = response.body;
      });

      it('should return status 200', () => {
        expect(response.status).toBe(200);
      });

      it('should return a token', () => {
        expect(authInfo.token).toBeDefined();
        expect(authInfo.token).toHaveLength(TOKEN_LENGTH);
      });
    });

    describe('Illegal Data', () => {
      beforeEach(async () => {
        response = await requester.put(url('/')).send({
          username: 'username1',
          password: 'wrong',
        });
      });

      it('should return status 401', () => {
        expect(response.status).toBe(401);
      });
    });
  });
});
