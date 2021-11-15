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
 * Create a query scoped context for each query when there is multiple queries
 * in a single request.
 *
 * MikroORM uses the _UnitOfWork_ and _IdentityMap_ pattern, which require the
 * {@link EntityManager} to be isolated between actions to provide a clean
 * _IdentityMap_ for each request handler.
 *
 * We can use `em.fork()` to get a new {@link EntityManager} inheriting the
 * original one's configurations but having its own _UnitOfWork_ and
 * _IdentityMap_ storage. But when we use a DI framework, like Nest's built-in
 * one, it will be hard to achieve this by simply forking one because the DI
 * framework always gives us a same {@link EntityManager} instance. So MikroORM
 * have another solution, that's the Context, which is made possible by the
 * {@link AsyncLocalStorage}.
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
 * ones, which can be easily achieved using middlewares:
 *
 * ```ts
 * app.use((req, res, next) => {
 *   storage.run(orm.em.fork(), next);
 * });
 * ```
 *
 * MikroORM wrapped these steps into the {@link RequestContext}, and the
 * {@link MikroOrmModule} will by default apply a middleware automatically to
 * achieve the isolation, which works well in most common use cases when there
 * is only one action in one request.
 *
 * But GraphQL supports multi-query requests. The client can send multiple
 * queries or mutations using an array and get an array of results. In a
 * multi-query request, multiple resolver methods will be invoked to execute
 * multiple actions. Guards, interceptors and so on will be invoked for each
 * resolver method, but middlewares will be invoked for only once during the
 * whole request. It means in a multi-query request, all the actions will share
 * a same context, which works well in multiple queries but not in multiple
 * mutations because {@link EntityManager.flush} may be invoked when another
 * flush has not completed and cause errors.
 *
 * To solve this, we must create the context in interceptors because this is
 * the only place where we can get the `next` object for each query in a
 * single request. And also we should make this interceptor to be invoked
 * before any other interceptors to ensure the other interceptors to be scoped
 * to the context. And because interceptors are invoked after guards, so DB
 * operations in guards are still not scoped to the context created in the
 * interceptor. Therefore, we must use both a middleware and an interceptor
 * to create both a request scoped context and a query scoped context, and
 * create the context with `clear` set to `false`, so that the DB operations in
 * guards will be scoped to the request scoped context and those in other
 * places will be scoped to the query scoped context. And because we have set
 * `clear` to `false`, the query scoped contexts will inherit the _UnitOfWork_
 * and _IdentityMap_ of the request scoped one, so that the `request.user`
 * object defined in guards will not be cleared from the _IdentityMap_. We
 * cannot use the {@link RequestContext} provided by MikroORM because it sets
 * `clear` to `true`. Note that because guards are still in a request scoped
 * context, we should avoid invoking {@link EntityManager.flush} because it
 * may probably cause some flush conflicts when there are multiple mutations.
 *
 * But there are still some potential issues. Nest applies interceptors to root
 * resolvers but not to the field resolvers. It means the `Observable` returned
 * by `next.handle()` will be finished after the root resolver is invoked.
 * Therefore, field resolvers will still be in the request scoped context. It
 * usually doesn't matter because usually we won't call
 * {@link EntityManager.flush} in field resolvers and also the uncleared
 * _UnitOfWork_ and _IdentityMap_ won't have much affect on our works. But when
 * we use {@link EntityManager.setFilterParams} inside an interceptor, we must
 * make the interceptor be executed before the query context interceptor, so
 * that the filter params will be defined in the request scoped context and
 * there won't be an `Error: No argument provided for filter ...` when field
 * resolver try to enable the filters.
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
