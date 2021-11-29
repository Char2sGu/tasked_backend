import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { BaseEntity } from 'src/mikro/base-entity.entity';
import { Quota } from 'src/mikro/mikro-quota/quota.decorator';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

import { RoomFilter } from '../room-filter.enum';

@Filter<Room>({
  name: CommonFilter.Crud,
  cond: () => ({
    $or: [
      { memberships: { owner: Context.current.user, deletedAt: null } },
      { isOpen: true },
    ],
  }),
})
@Filter<Room>({
  name: RoomFilter.IsJoined,
  cond: () => ({
    memberships: { owner: Context.current.user, deletedAt: null },
  }),
})
@Filter<Room>({
  name: RoomFilter.IsOpen,
  cond: (args: { value?: boolean }) =>
    args.value == undefined ? {} : { isOpen: args.value },
})
@Entity()
@ObjectType()
export class Room extends BaseEntity<Room> {
  @Field(() => String)
  @Property()
  name: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => Boolean)
  @Property()
  isOpen: boolean;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.room,
    orphanRemoval: true,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @Quota(50)
  @Field(() => PaginatedMemberships)
  @OneToMany({
    entity: () => Membership,
    mappedBy: (membership) => membership.room,
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);

  @Field(() => PaginatedTasks)
  @OneToMany({
    entity: () => Task,
    mappedBy: (task) => task.room,
    orphanRemoval: true,
  })
  tasks = new Collection<Task>(this);
}
