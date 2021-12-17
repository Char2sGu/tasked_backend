import { AsyncLocalStorage } from 'async_hooks';

export class DataLoaderContext {
  static get current() {
    return this.storage.getStore();
  }
  private static storage = new AsyncLocalStorage<DataLoaderContext>();

  cacheMapContexts = new Map<unknown, Map<unknown, unknown>>();

  apply<T>(next: () => T) {
    return DataLoaderContext.storage.run(this, next);
  }
}
