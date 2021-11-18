import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { BaseEntity } from 'src/mikro/base-entity.entity';
import { CRUD_FILTER } from 'src/mikro-filters/mikro-filters.constants';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Classroom>({
  name: CRUD_FILTER,
  cond: ({ user }: { user: User }) => ({
    $or: [{ memberships: { owner: user } }, { isOpen: true }],
  }),
})
@Entity()
export class Classroom extends BaseEntity<Classroom> {
  @Field(() => String)
  @Property()
  name: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => Boolean)
  @Property()
  isOpen: boolean;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.classroom,
    orphanRemoval: true,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @Field(() => PaginatedMemberships)
  @OneToMany({
    entity: () => Membership,
    mappedBy: (membership) => membership.classroom,
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);

  @Field(() => PaginatedTasks)
  @OneToMany({
    entity: () => Task,
    mappedBy: (task) => task.classroom,
    orphanRemoval: true,
  })
  tasks = new Collection<Task>(this);
}
