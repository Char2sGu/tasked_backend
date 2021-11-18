import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';

export class Context {
  private static storage = new AsyncLocalStorage<Context>();

  static get current() {
    return this.storage.getStore();
  }

  constructor(public request: Request) {}

  apply<T>(fn: () => T) {
    return Context.storage.run(this, fn);
  }
}
