import { EntityManager } from '@mikro-orm/sqlite';
import { HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { ApplicationStatus } from 'src/join-applications/application-status.enum';
import { CreateJoinApplicationDto } from 'src/join-applications/dto/create-join-application.dto';
import { UpdateJoinApplicationDto } from 'src/join-applications/dto/update-join-application.dto';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { PREFIX } from 'src/join-applications/join-applications.controller';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/role.enum';
import { User } from 'src/users/entities/user.entity';
import supertest, { Response } from 'supertest';
import { prepareE2E, urlBuilder } from 'test/utils';

const url = urlBuilder(`/${PREFIX}`);

describe(url(''), () => {
  let module: TestingModule;
  let requester: supertest.SuperTest<supertest.Test>;
  let entityManager: EntityManager;
  let tokens: Record<'creator' | 'someone' | 'student', string>;
  let response: Response;
  let users: Record<'creator' | 'teacher' | 'student' | 'someone', User>;
  let classrooms: Record<'a' | 'b', Classroom>;
  let memberships: Record<
    'creatorA' | 'creatorB' | 'teacherA' | 'studentA',
    Membership
  >;
  let applications: JoinApplication[];
  let createDto: CreateJoinApplicationDto;
  let updateDto: UpdateJoinApplicationDto;

  function assertSerializedApplication(
    application: JoinApplication,
    data: Partial<Record<keyof JoinApplication, unknown>> = {},
  ) {
    const {
      id,
      owner,
      classroom,
      role,
      message,
      status,
      updatedAt,
      createdAt,
      ...rest
    } = application;

    expect(id).toBeDefined();
    expect(owner).toBeDefined();
    expect(classroom).toBeDefined();
    expect(role).toBeDefined();
    expect(message).toBeDefined();
    expect(status).toBeDefined();
    expect(updatedAt).toBeDefined();
    expect(createdAt).toBeDefined();
    expect(rest).toEqual({});

    for (const k in data) expect(application[k]).toBe(data[k]);
  }

  beforeEach(async () => {
    ({ module, requester } = await prepareE2E());

    entityManager = module.get(EntityManager);

    const HASHED_PASSWORD = // "password"
      '$2a$10$a50UJxxNGkLOoLfuB.g6be2EKZDrYvrYWVFbpNTCkqgHi/eMA0IDm';

    users = {
      creator: entityManager.create(User, {
        username: 'creator',
        password: HASHED_PASSWORD,
      }),
      teacher: entityManager.create(User, {
        username: 'teacher',
        password: HASHED_PASSWORD,
      }),
      student: entityManager.create(User, {
        username: 'student',
        password: HASHED_PASSWORD,
      }),
      someone: entityManager.create(User, {
        username: 'someone',
        password: HASHED_PASSWORD,
      }),
    };
    entityManager.persist(Object.values(users));

    classrooms = {
      a: entityManager.create(Classroom, {
        name: 'classroom-A',
        creator: users.creator,
      }),
      b: entityManager.create(Classroom, {
        name: 'classroom-B',
        creator: users.someone,
      }),
    };
    entityManager.persist(Object.values(classrooms));

    memberships = {
      creatorA: entityManager.create(Membership, {
        owner: users.creator,
        classroom: classrooms.a,
        displayName: 'A-creator',
        role: Role.Teacher,
      }),
      teacherA: entityManager.create(Membership, {
        owner: users.teacher,
        classroom: classrooms.a,
        displayName: 'A-teacher',
        role: Role.Teacher,
      }),
      studentA: entityManager.create(Membership, {
        owner: users.student,
        classroom: classrooms.a,
        displayName: 'A-studnet',
        role: Role.Student,
      }),
      creatorB: entityManager.create(Membership, {
        owner: users.someone,
        classroom: classrooms.b,
        displayName: 'B-creator',
        role: Role.Teacher,
      }),
    };
    entityManager.persist(Object.values(memberships));

    applications = [
      entityManager.create(JoinApplication, {
        owner: users.creator,
        classroom: classrooms.b,
        role: Role.Student,
        status: ApplicationStatus.Pending,
      }),
      entityManager.create(JoinApplication, {
        owner: users.someone,
        classroom: classrooms.a,
        role: Role.Student,
        status: ApplicationStatus.Pending,
      }),
      entityManager.create(JoinApplication, {
        owner: users.someone,
        classroom: classrooms.a,
        role: Role.Student,
        status: ApplicationStatus.Rejected,
      }),
      entityManager.create(JoinApplication, {
        owner: users.someone,
        classroom: classrooms.b,
        role: Role.Student,
        status: ApplicationStatus.Pending,
      }),
    ];
    entityManager.persist(applications);

    await entityManager.flush();

    if (!tokens) {
      const authService = module.get(AuthService);
      tokens = {
        creator: await authService.obtainJwt('creator', 'password'),
        student: await authService.obtainJwt('student', 'password'),
        someone: await authService.obtainJwt('someone', 'password'),
      };
    }
  });

  describe('/ (GET)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .get(url('/'))
          .auth(tokens.creator, { type: 'bearer' });
      });

      it('should return the total as 3', () => {
        expect(response.body.total).toBe(3);
      });

      it(
        'should return the application entities sent by the user or the ones sent to ' +
          'the classrooms created by the user',
        () => {
          const applications: JoinApplication[] = response.body.results;
          applications.forEach((application) => {
            assertSerializedApplication(application);
            expect(
              (application.owner as unknown) == users.creator.id ||
                (application.classroom as unknown) == classrooms.a.id,
            ).toBe(true);
          });
        },
      );
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
    describe('Basic', () => {
      beforeEach(async () => {
        createDto = { classroom: classrooms.b.id, role: Role.Student };
        response = await requester
          .post(url('/'))
          .auth(tokens.student, { type: 'bearer' })
          .send(createDto);
      });

      it(`should return status ${HttpStatus.CREATED}`, () => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });

      it('should return the created application entity', () => {
        assertSerializedApplication(response.body, {
          ...createDto,
          owner: users.student.id,
        });
      });
    });

    describe.each`
      description                      | classroom                | token
      ${'already a member'}            | ${() => classrooms.a.id} | ${() => tokens.creator}
      ${'already sent an application'} | ${() => classrooms.a.id} | ${() => tokens.creator}
    `('Duplicate: $description', ({ classroom, token }) => {
      beforeEach(async () => {
        createDto = { classroom: classroom(), role: Role.Student };
        response = await requester
          .post(url('/'))
          .auth(token(), { type: 'bearer' })
          .send(createDto);
      });

      it(`should return status ${HttpStatus.FORBIDDEN}`, () => {
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        createDto = { classroom: classrooms.a.id, role: Role.Student };
        response = await requester.post(url('/')).send(createDto);
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/:id/ (GET)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        response = await requester
          .get(url(`/${applications[0].id}/`))
          .auth(tokens.creator, { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the target application entity', () => {
        assertSerializedApplication(response.body, { id: applications[0].id });
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        response = await requester.get(url(`/${applications[0].id}/`));
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/:id/ (PATCH)', () => {
    describe('Basic', () => {
      beforeEach(async () => {
        updateDto = { role: Role.Teacher };
        response = await requester
          .patch(url(`/${applications[1].id}/`))
          .auth(tokens.creator, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the updated application entity', () => {
        assertSerializedApplication(response.body, {
          id: applications[1].id,
          ...updateDto,
        });
      });
    });

    describe('Accepting', () => {
      beforeEach(async () => {
        updateDto = { status: ApplicationStatus.Accepted };
        response = await requester
          .patch(url(`/${applications[1].id}/`))
          .auth(tokens.creator, { type: 'bearer' })
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.OK}`, () => {
        expect(response.status).toBe(HttpStatus.OK);
      });

      it('should return the updated application entity', () => {
        assertSerializedApplication(response.body, {
          id: applications[1].id,
          ...updateDto,
        });
      });

      it('should create the membership', async () => {
        const { owner, classroom, role } = applications[1];
        const membership = await entityManager.findOne(Membership, {
          owner,
          classroom,
          role,
        });
        expect(membership).toBeDefined();
      });
    });

    describe.each`
      description               | id                          | token
      ${'rejected application'} | ${() => applications[2].id} | ${() => tokens.creator}
      ${'not as the creator'}   | ${() => applications[1].id} | ${() => tokens.someone}
    `('Forbidden: $description', ({ id, token }) => {
      beforeEach(async () => {
        response = await requester
          .patch(url(`/${id()}/`))
          .auth(token(), { type: 'bearer' });
      });

      it(`should return status ${HttpStatus.FORBIDDEN}`, () => {
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      });
    });

    describe('Not Authed', () => {
      beforeEach(async () => {
        updateDto = {};
        response = await requester
          .patch(url(`/${applications[1].id}/`))
          .send(updateDto);
      });

      it(`should return status ${HttpStatus.UNAUTHORIZED}`, () => {
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
