import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { BaseEntity } from '../base-entity.entity';
import { MikroRefLoaderContext } from './mikro-ref-loader-context.class';
import { MikroRefLoaderDataLoader } from './mikro-ref-loader-data-loader.class';

@Injectable()
export class MikroRefLoaderService {
  constructor(private em: EntityManager) {}

  async load<Entity extends BaseEntity<Entity>>(ref: Entity) {
    const type = ref.constructor.name;
    const entity = this.em.getUnitOfWork().tryGetById(type, ref);
    return entity?.isInitialized()
      ? entity
      : this.getLoader<Entity>(type).load(ref.id);
  }

  /**
   * Get or create a data loader of the specified entity type in tge current
   * context.
   * @param type
   * @returns
   */
  private getLoader<Entity extends BaseEntity<Entity>>(
    type: string,
  ): MikroRefLoaderDataLoader<Entity, 'id'> {
    const loaders = MikroRefLoaderContext.current.loaders;
    return (
      loaders[type] ??
      (loaders[type] = new MikroRefLoaderDataLoader(this.em, type, 'id'))
    );
  }
}
