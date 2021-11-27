import { AsyncLocalStorage } from 'async_hooks';

export class AuthGuardContext {
  static get current() {
    return this.storage.getStore();
  }
  private static storage = new AsyncLocalStorage<AuthGuardContext>();

  /**
   * The authentication result of any queries in this request.
   */
  result?: Promise<void>;

  apply<T>(fn: () => T) {
    return AuthGuardContext.storage.run(this, fn);
  }
}
