import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Application } from 'src/applications/entities/application.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.obj.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Quota } from 'src/mikro/mikro-quota/quota.decorator';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.obj.dto';
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
  @Field(() => String, { orderable: true })
  @Property()
  name: string;

  @Field(() => String, { nullable: true, orderable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => Boolean, { orderable: true })
  @Property()
  isOpen: boolean;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @OneToMany({
    entity: () => Application,
    mappedBy: (application) => application.room,
    orphanRemoval: true,
  })
  applications = new Collection<Application>(this);

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
