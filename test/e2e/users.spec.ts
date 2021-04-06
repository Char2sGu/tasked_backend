import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { getTypeOrmRootModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStragegy } from 'src/auth/jwt.strategy';
import { useGlobalComponents } from 'src/main';
import { Paginated } from 'src/paginated.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Gender } from 'src/users/gender.enum';
import { PREFIX, UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';
import { genUsers } from 'test/gen-data';
import { getConnection, Repository } from 'typeorm';

describe(UsersController.name, () => {
  const COUNT = 3;

  let repository: Repository<User>;
  let users: User[] = [];
  let token: string;

  let app: INestApplication;
  let httpServer: unknown;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        getTypeOrmRootModule(true),
        UsersModule,
        JwtModule.register({ secret: process.env.SECRET_KEY }),
      ],
      providers: [AuthService, JwtStragegy],
    }).compile();

    repository = moduleFixture.get(getRepositoryToken(User));

    app = moduleFixture.createNestApplication();
    useGlobalComponents(app);
    await app.init();
    httpServer = app.getHttpServer();

    users = await genUsers(repository, COUNT);
    token = await moduleFixture
      .get(AuthService)
      .obtainJwt(users[0].username, 'password1');
  });

  afterEach(async () => {
    await getConnection().close();
    await app.close();
  });

  describe(`/${PREFIX}/ (GET)`, () => {
    it('should return a 401 when not authed', async () => {
      await request(httpServer).get(`/${PREFIX}/`).expect(401);
    });

    it.each([
      [() => '', 0, COUNT],
      [() => '', 1, 1],
      [() => users[0].id, 0, COUNT - 1],
      [() => users[0].id, 1, 1],
    ])(
      'should return a list of specified entities with 200 when authed',
      async (after, limit, count) => {
        await request(httpServer)
          .get(`/${PREFIX}/?after=${after()}&limit=${limit}`)
          .auth(token, { type: 'bearer' })
          .expect(200)
          .expect(({ body }: { body: Paginated<User> }) => {
            expect(body.results.length).toBe(count);
          });
      },
    );
  });

  describe(`/${PREFIX}/ (POST)`, () => {
    const dtos: Partial<CreateUserDto>[] = [
      {},
      { username: 'lackofparams' },
      { username: ' illegal', password: 'short' },
    ];
    it.each(dtos)(
      'should return a 400 when passed illegal data',
      async (dto) => {
        await request(httpServer).post(`/${PREFIX}/`).send(dto).expect(400);
      },
    );

    it('should return the created entity with 201 when passed legal data', async () => {
      const dto: CreateUserDto = { username: 'legal', password: 'legalpwd' };
      await request(httpServer)
        .post(`/${PREFIX}/`)
        .send(dto)
        .expect(201)
        .expect(({ body }: { body: Partial<User> }) => {
          expect(body.username).toBe(dto.username);
          expect(body.password).toBeUndefined();
          expect(body.gender).toBe(Gender.Unknown);
        });
    });
  });

  describe(`/${PREFIX}/:username/ (GET)`, () => {
    it('should return a 401 when not authed', async () => {
      await request(httpServer).get(`/${PREFIX}/anything/`).expect(401);
    });

    it('should return the target entity with 200 when authed and exists', async () => {
      await request(httpServer)
        .get(`/${PREFIX}/${users[0].username}/`)
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect(({ body }: { body: User }) => {
          expect(body.id).toBe(users[0].id);
          expect(body.password).toBeUndefined();
        });
    });

    it('should return a 404 when authed but not exists', async () => {
      await request(httpServer)
        .get(`/${PREFIX}/notexists/`)
        .auth(token, { type: 'bearer' })
        .expect(404);
    });
  });

  describe(`/${PREFIX}/:username/ (PATCH)`, () => {
    it('should return a 401 when not authed', async () => {
      await request(httpServer)
        .patch(`/${PREFIX}/${users[0].username}/`)
        .expect(401);
    });

    it('should return a 404 when the target not exists', async () => {
      await request(httpServer)
        .patch(`/${PREFIX}/notexists/`)
        .auth(token, { type: 'bearer' })
        .expect(404);
    });

    it('should return a 400 when passed illegal data', async () => {
      const dto: UpdateUserDto = { username: 'i llegal', password: '' };
      await request(httpServer)
        .patch(`/${PREFIX}/${users[0].username}/`)
        .auth(token, { type: 'bearer' })
        .send(dto)
        .expect(400);
    });

    it('should update and return the target and a 200', async () => {
      const dto: UpdateUserDto = { username: 'updated', password: 'updated' };
      await request(httpServer)
        .patch(`/${PREFIX}/${users[0].username}/`)
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

  describe(`/${PREFIX}/:username/ (DELETE)`, () => {
    it('should return a 401 when not authed', async () => {
      await request(httpServer).delete(`/${PREFIX}/anything/`).expect(401);
    });

    it('should delete the target and return a 204 when it exists', async () => {
      await request(httpServer)
        .delete(`/${PREFIX}/${users[0].username}/`)
        .auth(token, { type: 'bearer' })
        .expect(204);
      await expect(
        repository.findOne({ username: users[0].username }),
      ).resolves.toBeUndefined();
    });

    it('should return a 404 when the target not exists', async () => {
      await request(httpServer)
        .delete(`/${PREFIX}/notexists/`)
        .auth(token, { type: 'bearer' })
        .expect(404);
    });
  });
});
