import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { Membership } from 'src/memberships/entities/membership.entity';
import { BaseEntity } from 'src/mikro/base-entity.entity';
import { CRUD_FILTER } from 'src/mikro-filters/crud-filter.constant';
import { Task } from 'src/tasks/entities/task.entity';

@ObjectType()
@Filter<Assignment>({
  name: CRUD_FILTER,
  cond: () => {
    const user = Context.current.user;
    return {
      $or: [
        { recipient: { owner: user } },
        { task: { creator: user } },
        {
          isPublic: true,
          task: { classroom: { memberships: { owner: user } } },
        },
      ],
    };
  },
  args: false,
})
@Entity()
export class Assignment extends BaseEntity<Assignment> {
  @Field(() => Membership)
  @ManyToOne({
    entity: () => Membership,
  })
  recipient: Membership;

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
