import DataLoaderBase from 'dataloader';

import { DataLoaderCacheMap } from './data-loader-cache-map.class';

export abstract class DataLoader<Key, Value> {
  private base: DataLoaderBase<Key, Value, Key>;

  constructor() {
    this.base = new DataLoaderBase((...args) => this.resolve(...args), {
      cacheMap: new DataLoaderCacheMap(this),
    });
  }

  load(key: Key): Promise<Value>;
  load(keys: Key[]): Promise<(Value | Error)[]>;
  async load(keys: Key | Key[]) {
    return keys instanceof Array
      ? this.base.loadMany(keys)
      : this.base.load(keys);
  }

  protected abstract resolve(keys: readonly Key[]): Promise<(Value | Error)[]>;
}
