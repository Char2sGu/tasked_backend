import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/base-entity.entity';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

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
  @ManyToOne({
    entity: () => User,
  })
  recipient: User;

  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @ManyToOne({
    entity: () => Task,
  })
  task: Task;

  @Property({
    default: false,
  })
  isPublic: boolean;

  @Property({
    default: false,
  })
  isCompleted: boolean;
}
