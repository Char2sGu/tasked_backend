import { EntityData, New } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/knex';

export class Repository<Entity> extends EntityRepository<Entity> {
  create<Population extends string = any>(
    data: EntityData<Entity>,
    persist = true,
  ): New<Entity, Population> {
    const result = super.create(data);
    if (persist) this.persist(result);
    return result;
  }
}
