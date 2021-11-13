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
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/field.decorator';
import { CRUD_FILTER } from 'src/crud/crud-filter.constant';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Task>({
  name: CRUD_FILTER,
  cond: ({ user }: { user: User }) => ({
    classroom: { deletedAt: null },
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

  @Field(() => Classroom)
  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

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
