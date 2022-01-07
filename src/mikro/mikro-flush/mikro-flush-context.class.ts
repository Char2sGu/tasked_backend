import { Deconstructed } from 'advanced-promises';
import { AsyncLocalStorage } from 'async_hooks';

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
   * Will be resolved after `em.flush()` is invoked and resolved.
   */
  flush = new Deconstructed();

  apply<T>(fn: () => T) {
    return MikroFlushContext.storage.run(this, fn);
  }
}
