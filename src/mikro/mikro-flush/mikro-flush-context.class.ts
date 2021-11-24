import { AsyncLocalStorage } from 'async_hooks';
import { Subject } from 'rxjs';

export class MikroFlushContext {
  static get current() {
    return this.storage.getStore();
  }
  private static storage = new AsyncLocalStorage<MikroFlushContext>();

  /**
   * Count of all mutations in the current request.
   */
  mutationCountTotal = 0;

  /**
   * Count of mutations which is already handled and waiting for flushing.
   */
  mutationCountHandled = 0;

  /**
   * The `em.flush()` result will be mapped here.
   */
  flush$ = new Subject<null>();

  apply<T>(fn: () => T) {
    return MikroFlushContext.storage.run(this, fn);
  }
}
