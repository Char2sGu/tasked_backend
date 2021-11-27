import { EntityManager, EntityName } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { BaseEntity } from '../base-entity.entity';
import { MikroRefLoaderContext } from './mikro-ref-loader-context.class';
import { MikroRefLoaderDataLoader } from './mikro-ref-loader-data-loader.class';

@Injectable()
export class MikroRefLoaderService {
  constructor(private em: EntityManager) {}

  async load<Entity extends BaseEntity<Entity>>(ref: Entity) {
    return this.getLoader(ref).load(ref.id);
  }

  /**
   * Get or create a data loader of the specified entity type in tge current
   * context.
   * @param entity
   * @returns
   */
  private getLoader<Entity extends BaseEntity<Entity>>(entity: Entity) {
    const name = entity.constructor.name;
    const loaders = MikroRefLoaderContext.current.loaders;
    const loader = (loaders[name] =
      loaders[name] ??
      new MikroRefLoaderDataLoader(this.em, name as EntityName<Entity>, 'id'));
    return loader;
  }
}
