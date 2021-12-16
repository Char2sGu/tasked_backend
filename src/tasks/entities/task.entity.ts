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
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { Room } from 'src/rooms/entities/room.entity';

@ObjectType()
@Filter<Task>({
  name: CommonFilter.Crud,
  cond: () => ({
    creator: { role: Role.Manager },
    $or: [
      { creator: { owner: Context.current.user } },
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
  @Field(() => Membership)
  @ManyToOne({
    entity: () => Membership,
  })
  creator: Membership;

  @Field(() => Room)
  @ManyToOne({
    entity: () => Room,
  })
  room: Room;

  @Field(() => String, { orderable: true, filterable: true })
  @Property()
  title: string;

  @Field(() => String, { nullable: true, orderable: true, filterable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => Boolean, { orderable: true, filterable: true })
  @Property()
  isActive: boolean;

  @Field(() => PaginatedAssignments)
  @OneToMany({
    entity: () => Assignment,
    mappedBy: (assignment) => assignment.task,
  })
  assignments = new Collection<Assignment>(this);
}
