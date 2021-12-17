import { AsyncLocalStorage } from 'async_hooks';
import { DataLoaderModule } from 'src/data-loader/data-loader.module';

import { MikroRefLoaderDataLoader } from './mikro-ref-loader-data-loader.class';

/**
 * @deprecated
 * @see {DataLoaderModule}
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

DataLoaderModule;
