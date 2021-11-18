import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';

export class Context {
  static get current() {
    return this.storage.getStore();
  }

  private static storage = new AsyncLocalStorage<Context>();

  constructor(private request: Request) {}

  get user() {
    return this.request.user;
  }

  apply<T>(fn: () => T) {
    return Context.storage.run(this, fn);
  }
}
