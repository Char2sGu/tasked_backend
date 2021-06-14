import { EntityManager } from '@mikro-orm/sqlite';
import { HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { PREFIX } from 'src/memberships/memberships.controller';
import { Role } from 'src/memberships/role.enum';
import { User } from 'src/users/entities/user.entity';
import supertest, { Response } from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
  enum Id {
    CreatorA = 1,
    TeacherA1,
    TeacherA2,
    StudentA1,
    StudentA2,
    CreatorB,
  }

  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let entityManager: EntityManager;
  let tokenCreatorA: string;
  let tokenTeacherA1: string;
  let tokenStudentA1: string;
  let response: Response;

  function assertSerializedMembership(
    membership: Membership,
    data: Partial<Record<keyof Membership, unknown>> = {},
  ) {
    const {
      id,
      owner,
      classroom,
      displayName,
      role,
      updatedAt,
      createdAt,
      ...rest
    } = membership;

    expect(id).toBeDefined();
    expect(owner).toBeDefined();
    expect(classroom).toBeDefined();
    expect(displayName).toBeDefined();
    expect(role).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(rest).toEqual({});

    for (const k in data) expect(membership[k]).toEqual(data[k]);
  }

  beforeEach(async () => {
    console.time('init');
    ({ module, requester } = await prepareE2E());

    entityManager = module.get(EntityManager);

    const HASHED_PASSWORD = // "password"
      '$2a$10$a50UJxxNGkLOoLfuB.g6be2EKZDrYvrYWVFbpNTCkqgHi/eMA0IDm';

    const users = [
      entityManager.create(User, {
        username: 'creator',
        password: HASHED_PASSWORD,
      }),
      entityManager.create(User, {
        username: 'teacher1',
        password: HASHED_PASSWORD,
      }),
      entityManager.create(User, {
        username: 'teacher2',
        password: HASHED_PASSWORD,
      }),
      entityManager.create(User, {
        username: 'student1',
        password: HASHED_PASSWORD,
      }),
      entityManager.create(User, {
        username: 'student2',
        password: HASHED_PASSWORD,
      }),
      entityManager.create(User, {
        username: 'someone',
        password: HASHED_PASSWORD,
      }),
    ];
    entityManager.persist(users);

    const classrooms = [
      entityManager.create(Classroom, {
        name: 'classroom-A',
        creator: users[0],
      }),
      entityManager.create(Classroom, {
        name: 'classroom-B',
        creator: users[1],
      }),
    ];
    entityManager.persist(classrooms);

    const memberships = [
      entityManager.create(Membership, {
        id: Id.CreatorA,
        owner: users[0],
        classroom: classrooms[0],
        displayName: 'creator-of-A',
        role: Role.Teacher,
      }),
      entityManager.create(Membership, {
        id: Id.TeacherA1,
        owner: users[1],
        classroom: classrooms[0],
        displayName: 'teacher-of-A-1',
        role: Role.Teacher,
      }),
      entityManager.create(Membership, {
        id: Id.TeacherA2,
        owner: users[2],
        classroom: classrooms[0],
        displayName: 'teacher-of-A-2',
        role: Role.Teacher,
      }),
      entityManager.create(Membership, {
        id: Id.StudentA1,
        owner: users[3],
        classroom: classrooms[0],
        displayName: 'student-of-A-1',
        role: Role.Student,
      }),
      entityManager.create(Membership, {
        id: Id.StudentA2,
        owner: users[4],
        classroom: classrooms[0],
        displayName: 'student-of-A-2',
        role: Role.Student,
      }),
      entityManager.create(Membership, {
        id: Id.CreatorB,
        owner: users[5],
        classroom: classrooms[1],
        displayName: 'creator-of-B',
        role: Role.Teacher,
      }),
    ];
    entityManager.persist(memberships);

    await entityManager.flush();

    const authService = module.get(AuthService);
    if (!tokenCreatorA) {
      tokenCreatorA = await authService.obtainJwt('creator', 'password');
      tokenTeacherA1 = await authService.obtainJwt('teacher1', 'password');
      tokenStudentA1 = await authService.obtainJwt('student1', 'password');
    }
  });

  describe('/ (GET)', () => {
    describe.each`
      token
      ${() => tokenCreatorA}
      ${() => tokenTeacherA1}
      ${() => tokenStudentA1}
    `('Common', ({ token }) => {
      beforeEach(async () => {
        response = await requester
          .get(url('/'))
          .auth(token(), { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return only the memberships of the classrooms the user has joined in', () => {
        const memberships: Membership[] = response.body.results;
        expect(memberships).toHaveLength(5);
        memberships.forEach((membership) =>
          assertSerializedMembership(membership, { classroom: 1 }),
        );
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

  describe('/:id/ (GET)', () => {
    describe('Common', () => {
      beforeEach(async () => {
        response = await requester
          .get(url('/1/'))
          .auth(tokenCreatorA, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return ths target membership entity', () => {
        assertSerializedMembership(response.body, { id: 1 });
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.get(url('/1/'));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('Wrong Target', () => {
      beforeEach(async () => {
        response = await requester
          .get(url('/6/'))
          .auth(tokenCreatorA, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.NOT_FOUND}`, () => {
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('/:id/ (DELETE)', () => {
    describe.each`
      description                   | id              | token
      ${'creator deleting teacher'} | ${Id.TeacherA1} | ${() => tokenCreatorA}
      ${'creator deleting student'} | ${Id.StudentA1} | ${() => tokenCreatorA}
      ${'teacher deleting self'}    | ${Id.TeacherA1} | ${() => tokenTeacherA1}
      ${'teacher deleting student'} | ${Id.StudentA1} | ${() => tokenTeacherA1}
      ${'student deleting self'}    | ${Id.StudentA1} | ${() => tokenStudentA1}
    `('Allowed Target: $description', ({ id, token }) => {
      beforeEach(async () => {
        response = await requester
          .delete(url(`/${id}/`))
          .auth(token(), { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.NO_CONTENT}`, () => {
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
      });

      it('should return nothing', () => {
        expect(response.body).toEqual({});
      });
    });

    describe.each`
      description                   | id              | token
      ${'creator deleting self'}    | ${Id.CreatorA}  | ${() => tokenCreatorA}
      ${'student deleting creator'} | ${Id.CreatorA}  | ${() => tokenStudentA1}
      ${'student deleting student'} | ${Id.StudentA2} | ${() => tokenStudentA1}
      ${'student deleting teacher'} | ${Id.TeacherA1} | ${() => tokenStudentA1}
      ${'teacher deleting creator'} | ${Id.CreatorA}  | ${() => tokenTeacherA1}
      ${'teacher deleting teacher'} | ${Id.TeacherA2} | ${() => tokenTeacherA1}
    `('Forbidden Target: $description', ({ id, token }) => {
      beforeEach(async () => {
        response = await requester
          .delete(url(`/${id}/`))
          .auth(token(), { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.FORBIDDEN}`, () => {
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.delete(url('/1/'));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
