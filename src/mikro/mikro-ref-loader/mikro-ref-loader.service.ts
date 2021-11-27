import { EntityManager, wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { MikroRefLoaderContext } from './mikro-ref-loader-context.class';
import { MikroRefLoaderDataLoader } from './mikro-ref-loader-data-loader.class';

@Injectable()
export class MikroRefLoaderService {
  constructor(private em: EntityManager) {}

  async load<Entity>(ref: Entity) {
    const type = ref.constructor.name;
    const entity = this.em.getUnitOfWork().tryGetById(type, ref);
    return wrap(entity)?.isInitialized()
      ? entity
      : this.getLoader<Entity>(type).load(ref);
  }

  private getLoader<Entity>(type: string): MikroRefLoaderDataLoader<Entity> {
    const loaders = MikroRefLoaderContext.current.loaders;
    return (
      loaders[type] ?? (loaders[type] = new MikroRefLoaderDataLoader(this.em))
    );
  }
}