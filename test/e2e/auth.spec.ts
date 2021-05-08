import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmRootModule } from 'src/app.module';
import { AuthInfo } from 'src/auth/auth-info.interface';
import { AuthController, PREFIX } from 'src/auth/auth.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ObtainTokenDto } from 'src/auth/dto/obtain-token.dto';
import { TOKEN_LENGTH } from 'src/constants';
import { User } from 'src/users/entities/user.entity';
import supertest, { Response } from 'supertest';
import {
  getRepositories,
  insertUsers,
  prepareE2E,
  urlBuilder,
} from 'test/utils';
import { getConnection, Repository } from 'typeorm';

const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
  let app: INestApplication;
  let requester: supertest.SuperTest<supertest.Test>;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [getTypeOrmRootModule(true), AuthModule],
    }).compile();

    ({ app, requester } = await prepareE2E(moduleFixture));
    [repository] = getRepositories(moduleFixture, User);

    await insertUsers(repository, 2, AuthController.name);
  });

  afterEach(async () => {
    await getConnection().close();
    await app.close();
  });

  describe('/ (POST) Right Data', () => {
    let response: Response;
    let body: AuthInfo;

    beforeEach(async () => {
      const data: ObtainTokenDto = {
        username: 'username1',
        password: 'password1',
      };
      response = await requester.post(url('/')).send(data);
      body = response.body;
    });

    it('should return 201', () => {
      expect(response.status).toBe(201);
    });

    it('should return a token in the body', () => {
      expect(body.token).toBeDefined();
      expect(body.token).toHaveLength(TOKEN_LENGTH);
    });

    it('should return the expiry date', () => {
      expect(body.expiresAt).toBeDefined();
      expect(new Date(body.expiresAt)).not.toBeNaN();
    });
  });

  describe('/ (POST) Wrong Data', () => {
    let response: Response;

    beforeEach(async () => {
      const data: ObtainTokenDto = {
        username: 'username1',
        password: 'wrong',
      };
      response = await requester.post(url('/')).send(data);
    });

    it('should return 401', () => {
      expect(response.status).toBe(401);
    });
  });
});
