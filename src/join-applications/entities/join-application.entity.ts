import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { CRUD_FILTER } from 'src/crud/crud-filter.constant';
import { Field } from 'src/shared/field.decorator';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from './application-status.enum';

@ObjectType()
@Filter<JoinApplication>({
  name: CRUD_FILTER,
  cond: ({ user }: { user: User }) => ({
    classroom: { deletedAt: null },
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

  @Field(() => String, { nullable: true })
  @Property({
    nullable: true,
  })
  message?: string;

  @Field(() => ApplicationStatus)
  @Property()
  status: ApplicationStatus;
}
