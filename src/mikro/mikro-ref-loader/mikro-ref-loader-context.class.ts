import { AsyncLocalStorage } from 'async_hooks';

import { MikroRefLoaderDataLoader } from './mikro-ref-loader-data-loader.class';

export class MikroRefLoaderContext {
  static get current() {
    return this.storage.getStore();
  }
  private static storage = new AsyncLocalStorage<MikroRefLoaderContext>();

  loaders: Record<string, MikroRefLoaderDataLoader<any, any>> = {};

  apply<T>(fn: () => T) {
    return MikroRefLoaderContext.storage.run(this, fn);
  }
}
