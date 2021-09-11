import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/base-entity.entity';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Assignment>({
  name: 'crud',
  cond: ({ user }: { user: User }) => ({
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
  @Property({
    default: false,
  })
  isPublic: boolean;

  @Field(() => Boolean)
  @Property({
    default: false,
  })
  isCompleted: boolean;
}
