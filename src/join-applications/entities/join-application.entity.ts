import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Role } from 'src/memberships/role.enum';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from '../application-status.enum';

@ObjectType()
@Filter<JoinApplication>({
  name: 'crud',
  cond: ({ user }: { user: User }) => ({
    $or: [{ owner: user }, { classroom: { creator: user } }],
  }),
})
@Entity()
export class JoinApplication extends BaseEntity<JoinApplication> {
  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  owner: User;

  @Field(() => Classroom)
  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @Field(() => Role)
  @Property()
  role: Role;

  @Field(() => String, { nullable: true })
  @Property({
    nullable: true,
  })
  message?: string;

  @Field(() => ApplicationStatus)
  @Property()
  status: ApplicationStatus;
}
