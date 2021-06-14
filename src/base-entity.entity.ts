import { BaseEntity as Base, PrimaryKey, Property } from '@mikro-orm/core';

export class BaseEntity<T extends BaseEntity<T>> extends Base<T, 'id'> {
  @PrimaryKey()
  readonly id: number;

  @Property({
    onCreate: () => new Date(),
  })
  readonly createdAt: Date;

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  readonly updatedAt: Date;
}
