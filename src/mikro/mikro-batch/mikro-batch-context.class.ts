import { AsyncLocalStorage } from 'async_hooks';

import { MikroBatchLoader } from './mikro-batch-loader.class';

export class MikroBatchContext {
  static get current() {
    return this.storage.getStore();
  }
  private static storage = new AsyncLocalStorage<MikroBatchContext>();

  loaders: Record<string, MikroBatchLoader<any, any>> = {};

  apply<T>(fn: () => T) {
    return MikroBatchContext.storage.run(this, fn);
  }
}
