import { EntityManager } from '@mikro-orm/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';

/**
 * Support multi-query requests for MikroORM.
 *
 * ### Previous Behavior
 *
 * MikroORM uses the _UnitOfWork_ and _IdentityMap_ pattern, which require the
 * {@link EntityManager} to be isolated between actions.
 *
 * We can use `em.fork()` to get a new {@link EntityManager} inheriting the
 * original one's configurations but having its own _UnitOfWork_ and
 * _IdentityMap_ storage.
 *
 * But when we use a DI framework, like Nest's built-in one, it will be hard to
 * achieve this by simply forking one because the DI framework always gives us
 * a same {@link EntityManager} instance. So MikroORM have another solution,
 * that's the Context, which is made possible by the {@link AsyncLocalStorage}.
 *
 * We can provide a context object as the first parameter of
 * {@link AsyncLocalStorage.run} and a function as the second one. Then the
 * function will be invoked inside the context, which means we can get the
 * previous context object using {@link AsyncLocalStorage.getStore}.
 *
 * So the new solution is to provide a fork of the original
 * {@link EntityManager} as the context, and run other processes inside the
 * context. We will still use the original {@link EntityManager}, but it will
 * check whether itself is inside a context and try to use the _UnitOfWork_
 * and _IdentityMap_ of the context {@link EntityManager} instead of its own
 * ones. This can be easily achieved using middlewares:
 *
 * ```ts
 * app.use((req, res, next) => {
 *   storage.run(orm.em.fork(), next);
 * });
 * ```
 *
 * MikroORM wrapped these steps into the {@link RequestContext}, and will
 * by default apply a middleware automatically to achieve the isolation.
 *
 * ### The Issue
 *
 * The middleware works well in most common use cases when there is only one
 * action in one request.
 *
 * But GraphQL supports multi-query requests. The client can send multiple
 * queries or mutations using an array and get an array of results. In a
 * multi-query request, multiple resolver methods will be invoked to execute
 * multiple actions. Guards, interceptors and so on will be invoked for each
 * resolver method, but middlewares will be invoked for only once during the
 * whole request. It means in a multi-query request, all the actions will share
 * a same {@link EntityManager}, which works well in multiple queries but not
 * in multiple mutations because {@link EntityManager.flush} may be invoked
 * when another flush is not completed and cause error.
 *
 * To solve this, we must create the context in interceptors because this is
 * the only place where we can get the `next` object. And also we should make
 * this interceptor to be invoked before any other interceptors to ensure the
 * other interceptors will be scoped to the context. Interceptors are invoked
 * after guards, so DB operations in guards are still not scoped to the context
 * created in the interceptor. Therefore, we must use both the middleware and
 * the interceptor and create the context with the `clear` option set to
 * `false`, so that the DB operations in guards will be scoped to the context
 * created in the middleware and those in other places will be scoped to
 * contexts created in the interceptor. And because we set `clear` to `false`,
 * the contexts created in the interceptor will inherit the _UnitOfWork_ and
 * _IdentityMap_ of the one created in the middleware, so that the
 * `request.user` object defined by the {@link AuthGuard} will not be cleared
 * from the _IdentityMap_. The {@link RequestContext} provided by MikroORM
 * should be abandoned because it sets `clear` to `true`.
 *
 * There are still some issues like we cannot invoke
 * {@link EntityManager.flush} in guards, but that is acceptable for we usually
 * won't do that in guards.
 */
@Injectable()
export class MikroQueryContextInterceptor implements NestInterceptor {
  static storage = new AsyncLocalStorage<EntityManager>();

  constructor(private em: EntityManager) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return new Observable((subscriber) => {
      MikroQueryContextInterceptor.storage.run(
        this.em.fork({ clear: false, useContext: true }),
        () => next.handle().subscribe(subscriber),
      );
    });
  }
}
