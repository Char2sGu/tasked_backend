import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/field.decorator';
import { CRUD_FILTER } from 'src/mikro/mikro-filters.constants';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Assignment>({
  name: CRUD_FILTER,
  cond: ({ user }: { user: User }) => ({
    task: { classroom: { deletedAt: null } },
    $or: [
      { recipient: user },
      { task: { creator: user } },
      { isPublic: true, task: { classroom: { memberships: { owner: user } } } },
    ],
  }),
})
@Entity()
export class Assignment extends BaseEntity<Assignment> {
  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  recipient: User;

  @Field(() => Task)
  @ManyToOne({
    entity: () => Task,
  })
  task: Task;

  @Field(() => Boolean)
  @Property()
  isPublic: boolean;

  @Field(() => Boolean)
  @Property()
  isCompleted: boolean;

  @Field(() => Boolean)
  @Property()
  isImportant: boolean;
}
