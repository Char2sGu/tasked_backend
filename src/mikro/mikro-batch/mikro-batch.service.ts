import { EntityManager, EntityName } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { BaseEntity } from '../base-entity.entity';
import { MikroBatchContextMiddleware } from './mikro-batch-context.middleware';
import { MikroBatchLoader } from './mikro-batch-loader.class';

@Injectable()
export class MikroBatchService {
  constructor(private em: EntityManager) {}

  async load<Entity extends BaseEntity<Entity>>(entity: Entity) {
    return this.getLoader(entity).load(entity.id);
  }

  /**
   * Get or create a data loader of the specified entity type in tge current
   * context.
   * @param entity
   * @returns
   */
  private getLoader<Entity extends BaseEntity<Entity>>(entity: Entity) {
    const name = entity.constructor.name;
    const map = MikroBatchContextMiddleware.current;
    const loader = (map[name] =
      map[name] ??
      new MikroBatchLoader(this.em, name as EntityName<Entity>, 'id'));
    return loader;
  }
}
