import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.obj.dto';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Orderable } from 'src/common/dto/order/orderable.decorator';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Task>({
  name: CommonFilter.Crud,
  cond: () => ({
    $or: [
      { creator: Context.current.user },
      {
        assignments: {
          recipient: { owner: Context.current.user },
          deletedAt: null,
        },
      },
    ],
  }),
})
@Entity()
export class Task extends BaseEntity<Task> {
  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @Field(() => Room)
  @ManyToOne({
    entity: () => Room,
  })
  room: Room;

  @Orderable()
  @Field(() => String)
  @Property()
  title: string;

  @Orderable()
  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Orderable()
  @Field(() => Boolean)
  @Property()
  isActive: boolean;

  @Field(() => PaginatedAssignments)
  @OneToMany({
    entity: () => Assignment,
    mappedBy: (assignment) => assignment.task,
    orphanRemoval: true,
  })
  assignments = new Collection<Assignment>(this);
}
