import { EntityManager } from '@mikro-orm/sqlite';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { concatMap } from 'rxjs';

import { MikroQueryContextInterceptor } from '../mikro-query-context/mikro-query-context.interceptor';
import { MikroFlushContext } from './mikro-flush-context.class';

/**
 * Invoke `em.flush()` after all mutations are handled.
 *
 * Replacement of {@link MikroQueryContextInterceptor}.
 *
 * As said in {@link MikroQueryContextInterceptor}, a multi-query GraphQL
 * request cannot have multiple mutations, otherwise `em.flush()` will
 * conflict. Query-scoped contexts do solved the problem, but it will invoke
 * `em.flush()` for each mutation in a single request, which is bad to the DB.
 * Later, I found that queries/mutations are handled paralleled, so I made this
 * {@link MikroFlushInterceptor} flush only after all the mutations are handled
 * instead of flushing for each mutation. Therefore, conflicts are gone forever
 * because `em.flush()` will now be called for only once during the whole
 * request.
 */
@Injectable()
export class MikroFlushInterceptor implements NestInterceptor {
  constructor(private em: EntityManager) {}

  intercept(executionContext: ExecutionContext, next: CallHandler) {
    const operation =
      GqlExecutionContext.create(executionContext).getInfo<GraphQLResolveInfo>()
        .operation.operation;

    if (operation != 'mutation') return next.handle();

    const context = MikroFlushContext.current;

    context.mutationCountTotal++;

    return next.handle().pipe(
      concatMap(async (result) => {
        context.mutationCountHandled++;

        const flush =
          context.mutationCountHandled == context.mutationCountTotal
            ? this.em
                .flush()
                .then(() => context.flush.resolve())
                .catch((err: unknown) => context.flush.reject(err))
            : context.flush;

        await flush;

        return result;
      }),
    );
  }
}

MikroQueryContextInterceptor;
