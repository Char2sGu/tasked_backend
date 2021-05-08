import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { compare } from 'bcryptjs';
import { getTypeOrmRootModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStragegy } from 'src/auth/jwt.strategy';
import { PAGINATION_MAX_LIMIT } from 'src/constants';
import { ListResponse } from 'src/list-response.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Gender } from 'src/users/gender.enum';
import { PREFIX, UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import supertest from 'supertest';
import {
  getRepositories,
  insertUsers,
  prepareE2E,
  urlBuilder,
} from 'test/utils';
import { getConnection, Repository } from 'typeorm';

type Resp = { body: ListResponse<User> };
const COUNT = PAGINATION_MAX_LIMIT + 10;
const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
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

  describe('/ (GET)', () => {
    it('should return a 401 when not authed', async () => {
      await requester.get(url('/')).expect(401);
    });

    it.each([[PAGINATION_MAX_LIMIT - 10, PAGINATION_MAX_LIMIT - 10]])(
      'should return %i entities when `limit` is %i',
      async (count, limit) => {
        await requester
          .get(url('/'))
          .query({ limit })
          .auth(token, { type: 'bearer' })
          .expect(200)
          .expect(({ body }: Resp) => {
            expect(body.total).toBe(COUNT);
            expect(body.results).toHaveLength(count);
          });
      },
    );

    it.each`
      limit
      ${0}
      ${''}
      ${PAGINATION_MAX_LIMIT + 5}
    `('should return a 400 when limit is $limit', async (queries) => {
      await requester
        .get(url('/'))
        .query(queries)
        .auth(token, { type: 'bearer' })
        .expect(400);
    });

    it.each([[1, COUNT - 1]])(
      'should return %i entities when `offset` is %i',
      async (count, offset) => {
        await requester
          .get(url('/'))
          .query({ offset })
          .auth(token, { type: 'bearer' })
          .expect(200)
          .expect(({ body }: Resp) => {
            expect(body.results).toHaveLength(count);
          });
      },
    );
  });

  describe('/ (POST)', () => {
    const dtos: Partial<CreateUserDto>[] = [
      {},
      { username: 'lackofparams' },
      { username: ' illegal', password: 'short' },
    ];
    it.each(dtos)(
      'should return a 400 when passed illegal data',
      async (dto) => {
        await requester.post(url('/')).send(dto).expect(400);
      },
    );

    it('should return the created entity with 201 when passed legal data', async () => {
      const dto: CreateUserDto = { username: 'legal', password: 'legalpwd' };
      await requester
        .post(url('/'))
        .send(dto)
        .expect(201)
        .expect(({ body }: { body: Partial<User> }) => {
          expect(body.username).toBe(dto.username);
          expect(body.password).toBeUndefined();
          expect(body.gender).toBe(Gender.Unknown);
        });
    });
  });

  describe('/:username/ (GET)', () => {
    it('should return a 401 when not authed', async () => {
      await requester.get(url('/anything/')).expect(401);
    });

    it('should return the target entity with 200 when authed and exists', async () => {
      await requester
        .get(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect(({ body }: { body: User }) => {
          expect(body.id).toBe(users[0].id);
          expect(body.password).toBeUndefined();
        });
    });

    it('should return a 404 when authed but not exists', async () => {
      await requester
        .get(url('/notexists/'))
        .auth(token, { type: 'bearer' })
        .expect(404);
    });
  });

  describe('/:username/ (PATCH)', () => {
    it('should return a 401 when not authed', async () => {
      await requester.patch(url(`/${users[0].username}/`)).expect(401);
    });

    it('should return a 404 when the target not exists', async () => {
      await requester
        .patch(url(`/notexists/`))
        .auth(token, { type: 'bearer' })
        .expect(404);
    });

    it('should return a 400 when passed illegal data', async () => {
      const dto: UpdateUserDto = { username: 'i llegal', password: '' };
      await requester
        .patch(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' })
        .send(dto)
        .expect(400);
    });

    it('should update and return the target and a 200', async () => {
      const dto: UpdateUserDto = { username: 'updated', password: 'updated' };
      await requester
        .patch(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' })
        .send(dto)
        .expect(200)
        .expect(async ({ body }: { body: User }) => {
          expect(body.username).toBe(dto.username);
          expect(body.password).toBeUndefined();
          const entity = await repository.findOne({ id: body.id });
          const compareResult = await compare(dto.password, entity.password);
          expect(compareResult).toBe(true);
        });
    });
  });

  describe('/:username/ (DELETE)', () => {
    it('should return a 401 when not authed', async () => {
      await requester.delete(url(`/anything/`)).expect(401);
    });

    it('should delete the target and return a 204 when it exists', async () => {
      await requester
        .delete(url(`/${users[0].username}/`))
        .auth(token, { type: 'bearer' })
        .expect(204);
      await expect(
        repository.findOne({ username: users[0].username }),
      ).resolves.toBeUndefined();
    });

    it('should return a 404 when the target not exists', async () => {
      await requester
        .delete(url('/notexists/'))
        .auth(token, { type: 'bearer' })
        .expect(404);
    });
  });
});
