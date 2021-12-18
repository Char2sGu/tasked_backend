import { AsyncLocalStorage } from 'async_hooks';
import { EntityRefLoader } from 'src/common/entity-ref-loader.class';

import { MikroRefLoaderDataLoader } from './mikro-ref-loader-data-loader.class';

/**
 * @deprecated
 * @see {EntityRefLoader}
 */
export class MikroRefLoaderContext {
  static get current() {
    return this.storage.getStore();
  }
  private static storage = new AsyncLocalStorage<MikroRefLoaderContext>();

  loaders: Record<string, MikroRefLoaderDataLoader<any>> = {};

  apply<T>(fn: () => T) {
    return MikroRefLoaderContext.storage.run(this, fn);
  }
}

EntityRefLoader;
