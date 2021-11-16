import { AnyEntity } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/sqlite';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { ApplicationStatus } from 'src/join-applications/entities/application-status.enum';
import { Role } from 'src/memberships/entities/role.enum';
import { Gender } from 'src/users/entities/gender.enum';

/**Hashed password `"password"` */
const PASSWORD = '$2a$10$a50UJxxNGkLOoLfuB.g6be2EKZDrYvrYWVFbpNTCkqgHi/eMA0IDm';

export default (em: EntityManager) => {
  const entities: AnyEntity[] = [];

  entities.push(
    em.create(Classroom, {
      id: 1,
      name: 'Classroom',
      description:
        'This is an example classroom, so there is nothing to write in the description.',
      creator: {
        id: 1,
        username: 'creator',
        password: PASSWORD,
        gender: Gender.Unknown,
      },
      memberships: [
        {
          id: 1,
          owner: 1,
          role: Role.Teacher,
        },
        {
          id: 2,
          owner: {
            id: 2,
            username: 'teacher',
            password: PASSWORD,
            gender: Gender.Male,
          },
          role: Role.Teacher,
        },
        {
          id: 3,
          owner: {
            id: 3,
            username: 'student',
            password: PASSWORD,
            gender: Gender.Female,
          },
          role: Role.Student,
        },
      ],
      tasks: [
        {
          id: 1,
          creator: 1,
          title: 'Task',
          description: 'Description',
          isActive: true,
          assignments: [
            {
              id: 1,
              recipient: 3,
              isCompleted: false,
              isImportant: false,
              isPublic: false,
            },
          ],
        },
      ],
      joinApplications: [
        {
          id: 1,
          owner: {
            id: 4,
            username: 'new-comer',
            password: PASSWORD,
            gender: Gender.Unknown,
          },
          classroom: 1,
          status: ApplicationStatus.Pending,
          message: 'I just want to join...',
        },
      ],
      isOpen: true,
    }),
  );

  return entities;
};
