import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export class Context {
  static get current() {
    return this.storage.getStore();
  }

  private static storage = new AsyncLocalStorage<Context>();

  public user?: User;

  constructor(request: Request) {
    this.user = request.user;
  }

  apply<T>(fn: () => T) {
    return Context.storage.run(this, fn);
  }
}
