import { EntityData, New } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/knex';

import { SOFT_DELETABLE } from './soft-deletable.symbol';

export class Repository<Entity> extends EntityRepository<Entity> {
  create<Population extends string = any>(
    data: EntityData<Entity>,
    persist = true,
  ): New<Entity, Population> {
    const result = super.create(data);
    if (persist) this.persist(result);
    return result;
  }

  delete(entity: Entity) {
    const softDeletableField: keyof Entity | undefined = Reflect.getMetadata(
      SOFT_DELETABLE,
      entity.constructor,
    );
    if (!softDeletableField) this.remove(entity);
    else entity[softDeletableField] = new Date() as any;
    return entity;
  }
}
