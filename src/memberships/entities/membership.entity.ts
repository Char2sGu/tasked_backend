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
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

import { Role } from './role.enum';

@ObjectType()
@Filter<Membership>({
  name: CommonFilter.Crud,
  cond: () => ({
    room: {
      memberships: { owner: Context.current.user, deletedAt: null },
    },
  }),
})
@Entity()
export class Membership extends BaseEntity<Membership> {
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

  @Field(() => PaginatedAssignments)
  @OneToMany({
    entity: () => Assignment,
    mappedBy: (assignment) => assignment.recipient,
    orphanRemoval: true,
  })
  assignments = new Collection<Assignment>(this);

  @Field(() => Role, { orderable: true })
  @Property()
  role: Role;
}
