import { BaseEntity as Base, PrimaryKey, Property } from '@mikro-orm/core';
import { ID, ObjectType } from '@nestjs/graphql';

import { Field } from './field.decorator';

@ObjectType()
export class BaseEntity<T extends BaseEntity<T>> extends Base<T, 'id'> {
  @Field(() => ID)
  @PrimaryKey()
  readonly id: number;

  @Field(() => Date)
  @Property({
    onCreate: () => new Date(),
  })
  readonly createdAt: Date;

  @Field(() => Date)
  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  readonly updatedAt: Date;
}
