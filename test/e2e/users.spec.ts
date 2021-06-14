import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { PREFIX } from 'src/users/users.controller';
import supertest, { Response } from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let repository: EntityRepository<User>;
  let token: string;
  let response: Response;
  let createDto: CreateUserDto;
  let updateDto: UpdateUserDto;

  function assertSerializedUser(user: User, data: Partial<User> = {}) {
    const {
      id,
      username,
      nickname,
      password,
      gender,
      classroomsCreated,
      joinApplications,
      memberships,
      updatedAt,
      createdAt,
      ...rest
    } = user;

    expect(id).toBeDefined();
    expect(username).toBeDefined();
    expect(nickname).toBeDefined();
    expect(password).toBeUndefined();
    expect(gender).toBeDefined();
    expect(classroomsCreated).toBeInstanceOf(Array);
    expect(joinApplications).toBeInstanceOf(Array);
    expect(memberships).toBeInstanceOf(Array);
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(rest).toEqual({});

    for (const k in data) expect(user[k]).toEqual(data[k]);
  }

  beforeEach(async () => {
    ({ module, requester } = await prepareE2E());

    repository = module.get<EntityRepository<User>>(getRepositoryToken(User));

    repository.persist([
      repository.create({
        username: 'username1',
        password: 'password1',
      }),
      repository.create({
        username: 'username2',
        password: 'password2',
      }),
    ]);

    await repository.flush();

    token = await module.get(AuthService).obtainJwt('username1', 'password1');
  });

  describe('/ (GET)', () => {
    let response: Omit<Response, 'body'> & {
      body: { total: number; results: User[] };
    };

    describe('Common', () => {
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

      it('should return the results as user entities', () => {
        response.body.results.forEach((entity) => assertSerializedUser(entity));
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.get(url('/'));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/ (POST)', () => {
    describe('Common', () => {
      beforeEach(async () => {
        createDto = { username: 'username', password: 'password' };
        response = await requester.post(url('/')).send(createDto);
      });

      it(`should return status ${HttpStatus.CREATED}`, () => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });

      it('should return a user entity', () => {
        assertSerializedUser(response.body);
      });
    });

    describe('Illegal Data', () => {
      beforeEach(async () => {
        response = await requester.post(url('/')).send({});
      });

      it(`should return status ${HttpStatus.BAD_GATEWAY}`, () => {
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('/:username/ (GET)', () => {
    describe('Common', () => {
      beforeEach(async () => {
        response = await requester
          .get(url('/username1/'))
          .auth(token, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the target user entity', () => {
        assertSerializedUser(response.body, { username: 'username1' });
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.get(url('/username1/'));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/:username/ (PATCH)', () => {
    beforeEach(() => {
      updateDto = { username: 'newusername' };
    });

    describe('Common', () => {
      beforeEach(async () => {
        jest
          .spyOn(User.prototype, 'isUpdatedRecently', 'get')
          .mockReturnValueOnce(false);
        response = await requester
          .patch(url('/username1/'))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the updated user entity', () => {
        assertSerializedUser(response.body, updateDto);
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.patch(url('/username1/'));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('Wrong Target', () => {
      beforeEach(async () => {
        response = await requester
          .patch(url('/username2/'))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.FORBIDDEN}`, () => {
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      });
    });

    describe('Too Frequently', () => {
      beforeEach(async () => {
        response = await requester
          .patch(url('/username1/'))
          .auth(token, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.FORBIDDEN}`, () => {
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      });
    });
  });
});
