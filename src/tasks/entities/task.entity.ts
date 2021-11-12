import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.dto';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/shared/field.decorator';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Task>({
  name: 'visible',
  cond: ({ user }: { user: User }) => ({
    assignments: { classroom: { deletedAt: null } },
    $or: [{ creator: user }, { assignments: { recipient: user } }],
  }),
})
@Entity()
export class Task extends BaseEntity<Task> {
  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @Field(() => String)
  @Property()
  title: string;

  @Field(() => String, { nullable: true })
  @Property({
    nullable: true,
  })
  description?: string;

  @Field(() => Boolean)
  @Property()
  isActive: boolean;

  @Field(() => PaginatedAssignments)
  @OneToMany({
    entity: () => Assignment,
    mappedBy: (assignment) => assignment.task,
  })
  assignments = new Collection<Assignment>(this);
}
