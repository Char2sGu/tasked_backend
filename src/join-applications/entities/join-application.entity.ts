import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { BaseEntity } from 'src/mikro/base-entity.entity';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from './application-status.enum';

@ObjectType()
@Filter<JoinApplication>({
  name: CommonFilter.CRUD,
  cond: () => ({
    $or: [
      { owner: Context.current.user },
      { classroom: { creator: Context.current.user } },
    ],
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
  @Property({ nullable: true })
  message?: string;

  @Field(() => ApplicationStatus)
  @Property()
  status: ApplicationStatus;
}
