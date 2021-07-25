import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { BaseEntity } from 'src/base-entity.entity';
import { User } from 'src/users/entities/user.entity';

@Filter<Task>({
  name: 'crud',
  cond: ({ user }: { user: User }) => ({
    $or: [{ creator: user }, { assignments: { recipient: user } }],
  }),
})
@Entity()
export class Task extends BaseEntity<Task> {
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @Property()
  title: string;

  @Property({
    nullable: true,
  })
  description: string | null;

  @OneToMany({
    entity: () => Assignment,
    mappedBy: (assignment) => assignment.task,
    hidden: true,
  })
  assignments = new Collection<Assignment>(this);
}
