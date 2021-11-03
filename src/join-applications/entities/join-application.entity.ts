import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/utilities/field.decorator';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from './application-status.enum';

@ObjectType()
@Filter<JoinApplication>({
  name: 'visible',
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

  @Field(() => String, { nullable: true })
  @Property({
    nullable: true,
  })
  message?: string;

  @Field(() => ApplicationStatus)
  @Property({
    default: ApplicationStatus.Pending,
  })
  status: ApplicationStatus;
}
