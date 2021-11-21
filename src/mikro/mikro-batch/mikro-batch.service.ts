import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

import { BaseEntity } from '../base-entity.entity';
import { MikroBatchContextMiddleware } from './mikro-batch-context.middleware';

@Injectable()
export class MikroBatchService {
  constructor(private em: EntityManager) {}

  async load<Entity extends BaseEntity<Entity>>(entity: Entity) {
    return this.getDataLoader(entity).load(entity);
  }

  /**
   * Get or create a data loader of the specified entity type in tge current
   * context.
   * @param entity
   * @returns
   */
  private getDataLoader<Entity extends BaseEntity<Entity>>(entity: Entity) {
    const name = entity.constructor.name;
    const map = MikroBatchContextMiddleware.current;
    const loader = (map[name] =
      map[name] ??
      new DataLoader(async (entities) => {
        const ids = entities.map((e) => e.id);
        // load required entities into the identity map
        await this.em.find(name, { id: { $in: ids } });
        return Promise.all(
          entities.map((entity) =>
            // this will trigger no SQL calls because they are already loaded
            // to the identity map.
            this.em.findOne(name, entity, {
              filters: false,
            }),
          ),
        );
      }));
    return loader;
  }
}
