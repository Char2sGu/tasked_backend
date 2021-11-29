import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { BaseEntity } from 'src/mikro/base-entity.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from './application-status.enum';

@ObjectType()
@Filter<JoinApplication>({
  name: CommonFilter.Crud,
  cond: () => ({
    $or: [
      { owner: Context.current.user },
      { room: { creator: Context.current.user } },
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

  @Field(() => Room)
  @ManyToOne({
    entity: () => Room,
  })
  room: Room;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  message?: string;

  @Field(() => ApplicationStatus)
  @Property()
  status: ApplicationStatus;
}
