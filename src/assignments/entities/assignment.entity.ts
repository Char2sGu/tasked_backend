import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/shared/field.decorator';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Assignment>({
  name: 'visible',
  cond: ({ user }: { user: User }) => ({
    classroom: { deletedAt: null },
    $or: [
      { recipient: user },
      { task: { creator: user } },
      { isPublic: true, classroom: { memberships: { owner: user } } },
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

  @Field(() => Classroom)
  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

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
