import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/base-entity.entity';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Role } from 'src/memberships/role.enum';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from '../application-status.enum';

@Filter<JoinApplication>({
  name: 'crud',
  cond: ({ user }: { user: User }) => ({
    $or: [{ owner: user }, { classroom: { creator: user } }],
  }),
})
@Entity()
export class JoinApplication extends BaseEntity<JoinApplication> {
  @ManyToOne({
    entity: () => User,
  })
  owner: User;

  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @Property()
  role: Role;

  @Property({
    nullable: true,
  })
  message?: string;

  @Property()
  status: ApplicationStatus;
}
