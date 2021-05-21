import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getTypeOrmRootModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStragegy } from 'src/auth/jwt.strategy';
import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from 'src/constants';
import { ListResponse } from 'src/list-response.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Gender } from 'src/users/gender.enum';
import { PREFIX, UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import supertest, { Response } from 'supertest';
import {
  getRepositories,
  insertUsers,
  prepareE2E,
  urlBuilder,
} from 'test/utils';
import { getConnection, Repository } from 'typeorm';

const COUNT = PAGINATION_MAX_LIMIT + 10;
const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
  function assertSerializedEntity(entity: User) {
    expect(entity.id).toBeDefined();
    expect(entity.username).toBeDefined();
    expect(entity.password).toBeUndefined();
    expect(entity.gender).toBeDefined();
    expect(entity.createdAt).toBeDefined();
    expect(entity.updatedAt).toBeDefined();
  }

  async function assertUpdatedEntity(
    body: User,
    data: UpdateUserDto | CreateUserDto,
  ) {
    if (data.username) expect(body.username).toBe(data.username);
    if (data.gender) expect(body.gender).toBe(data.gender);
  }

  let app: INestApplication;
  let requester: supertest.SuperTest<supertest.Test>;
  let repository: Repository<User>;

  let users: User[] = [];
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        getTypeOrmRootModule(true),
        UsersModule,
        JwtModule.register({ secret: process.env.SECRET_KEY }),
      ],
      providers: [AuthService, JwtStragegy],
    }).compile();

    ({ app, requester } = await prepareE2E(moduleFixture));
    [repository] = getRepositories(moduleFixture, User);

    users = await insertUsers(repository, COUNT, UsersController.name);
    token = await moduleFixture
      .get(AuthService)
      .obtainJwt(users[0].username, 'password1');
  });

  afterEach(async () => {
    await getConnection().close();
    await app.close();
  });

  let response: Response;

  describe('/ (GET) No Auth', () => {
    beforeEach(async () => {
      response = await requester.get(url('/'));
    });

    it('should return 401', () => {
      expect(response.status).toBe(401);
    });
  });

  describe.each`
    limit                       | offset       | count
    ${PAGINATION_MAX_LIMIT - 1} | ${undefined} | ${PAGINATION_MAX_LIMIT - 1}
    ${undefined}                | ${1}         | ${PAGINATION_DEFAULT_LIMIT}
  `(
    '/?limit=$limit&offset=$offset (GET) Legal Queries',
    ({ count, ...queries }) => {
      let body: ListResponse<User>;

      beforeEach(async () => {
        response = await requester
          .get(url('/'))
          .query(queries)
          .auth(token, { type: 'bearer' });
        body = response.body;
      });

      it('should return 200', () => {
        expect(response.status).toBe(200);
      });

      it('should return the total number of all the entities', () => {
        expect(body.total).toBe(COUNT);
      });

      it(`should return ${count} entities`, () => {
        expect(body.results).toHaveLength(count);
        assertSerializedEntity(body.results[0]);
      });
    },
  );

  describe.each`
    limit                       | offset
    ${0}                        | ${undefined}
    ${''}                       | ${undefined}
    ${PAGINATION_MAX_LIMIT + 5} | ${undefined}
    ${undefined}                | ${0}
    ${undefined}                | ${''}
  `('/?limit=$limit (GET) Illegal Queries', (queries) => {
    beforeEach(async () => {
      response = await requester
        .get(url('/'))
        .query(queries)
        .auth(token, { type: 'bearer' });
    });

    it('should return 400', () => {
      expect(response.status).toBe(400);
    });
  });

  describe.each`
    data
    ${{}}
    ${{ username: 'lackofparams' }}
    ${{ username: ' illegal', password: 'short' }}
  `('/ $data (POST) Illegal Data', ({ data }) => {
    beforeEach(async () => {
      response = await requester.post(url('/')).send(data);
    });

    it('should return 400', () => {
      expect(response.status).toBe(400);
    });
  });

  describe.each`
    data
    ${{ username: 'legal', password: 'legalpwd' }}
  `('/ $data (POST) Legal Data', ({ data }) => {
    beforeEach(async () => {
      response = await requester.post(url('/')).send(data);
    });

    it('should return 201', () => {
      expect(response.status).toBe(201);
    });

    it('should return an entity', () => {
      assertSerializedEntity(response.body);
    });
  });

  describe('/anything/ (GET) No Auth', () => {
    beforeEach(async () => {
      response = await requester.get(url('/anything/'));
    });

    it('should return 401', () => {
      expect(response.status).toBe(401);
    });
  });

  describe('/<lookup>/ (GET) Legal Lookup', () => {
    beforeEach(async () => {
      response = await requester
        .get(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' });
    });

    it('should return 200', () => {
      expect(response.status).toBe(200);
    });

    it('should return an entity', () => {
      assertSerializedEntity(response.body);
    });
  });

  describe('/notexists/ (GET) Target Not Exists', () => {
    beforeEach(async () => {
      response = await requester
        .get(url('/notexists/'))
        .auth(token, { type: 'bearer' });
    });

    it('should return 404', () => {
      expect(response.status).toBe(404);
    });
  });

  describe('/anything/ (PATCH) No Auth', () => {
    beforeEach(async () => {
      response = await requester.patch(url('/anything/'));
    });

    it('should return 401', () => {
      expect(response.status).toBe(401);
    });
  });

  describe('/notexists/ (PATCH) Target Not Exists', () => {
    beforeEach(async () => {
      response = await requester
        .patch(url('/notexists/'))
        .auth(token, { type: 'bearer' })
        .send({});
    });

    it('should return 404', () => {
      expect(response.status).toBe(404);
    });
  });

  describe.each`
    data
    ${{ username: 'illegal ' }}
    ${{ password: '' }}
    ${{ gender: 'wtf' }}
  `('/<lookup>/ $data (PATCH) Illegal Data', ({ data }) => {
    beforeEach(async () => {
      response = await requester
        .patch(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' })
        .send(data);
    });

    it('should return 400', () => {
      expect(response.status).toBe(400);
    });
  });

  describe.each`
    data
    ${{ username: 'updated', password: 'updated' }}
    ${{}}
  `('/<lookup>/ $data (PATCH) All Legal', ({ data }) => {
    beforeEach(async () => {
      response = await requester
        .patch(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' })
        .send(data);
    });

    it('should return 200', () => {
      expect(response.status).toBe(200);
    });

    it('should return an updated entity', async () => {
      assertSerializedEntity(response.body);
      assertUpdatedEntity(response.body, data);
    });
  });

  describe('/anything/ (PUT) No Auth', () => {
    beforeEach(async () => {
      response = await requester.put(url('/anything/'));
    });

    it('should return 401', () => {
      expect(response.status).toBe(401);
    });
  });

  describe('/notexists/ (PUT) Target Not Exists', () => {
    beforeEach(async () => {
      response = await requester
        .put(url('/notexists/'))
        .auth(token, { type: 'bearer' })
        .send({
          username: 'aaaaaa',
          password: 'abcdef',
          gender: Gender.Male,
        });
    });

    it('should return 404', () => {
      expect(response.status).toBe(404);
    });
  });

  describe.each`
    data
    ${{}}
    ${{ username: 'illegal ', password: '123456', gender: Gender.Male }}
  `('/<lookup>/ $data (PUT) Illegal Data', ({ data }) => {
    beforeEach(async () => {
      response = await requester
        .put(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' })
        .send(data);
    });

    it('should return 400', () => {
      expect(response.status).toBe(400);
    });
  });

  describe.each`
    data
    ${{ username: 'updated', password: '123456', gender: Gender.Female }}
  `('/<lookup>/ $data (PUT) All Legal', ({ data }) => {
    beforeEach(async () => {
      response = await requester
        .put(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' })
        .send(data);
    });

    it('should return 200', () => {
      expect(response.status).toBe(200);
    });

    it('should return an updated entity', async () => {
      assertSerializedEntity(response.body);
      assertUpdatedEntity(response.body, data);
    });
  });
});
