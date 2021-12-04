import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/base-entity.entity';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Task } from 'src/tasks/entities/task.entity';

@ObjectType()
@Filter<Assignment>({
  name: CommonFilter.Crud,
  cond: () => {
    const user = Context.current.user;
    return {
      $or: [{ recipient: { owner: user } }, { task: { creator: user } }],
    };
  },
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

  @Field(() => Boolean, { orderable: true, filterable: true })
  @Property()
  isCompleted: boolean;

  @Field(() => Boolean, { orderable: true, filterable: true })
  @Property()
  isImportant: boolean;
}
