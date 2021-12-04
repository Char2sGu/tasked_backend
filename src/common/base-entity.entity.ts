import { BaseEntity as Base, PrimaryKey, Property } from '@mikro-orm/core';
import { ID, ObjectType } from '@nestjs/graphql';
import { SoftDeletable } from 'src/mikro/soft-deletable/soft-deletable.decorator';

import { Field } from './field.decorator';

/**
 * A wrap of mikro-orm's `BaseEntity`, as the base class of every entity class
 * in this project.
 */
@ObjectType()
@SoftDeletable(() => BaseEntity, 'deletedAt', () => new Date())
export class BaseEntity<T extends BaseEntity<T>> extends Base<T, 'id'> {
  @Field(() => ID, { orderable: true })
  @PrimaryKey()
  readonly id: number;

  @Field(() => Date, { orderable: true })
  @Property({ onCreate: () => new Date() })
  readonly createdAt: Date;

  @Field(() => Date, { orderable: true })
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  readonly updatedAt: Date;

  @Property({ nullable: true })
  readonly deletedAt?: Date;
}
