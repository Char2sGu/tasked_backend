import { EntityManager } from '@mikro-orm/sqlite';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { concatMap, from, map, Observable, of } from 'rxjs';

/**
 * Invoke `em.flush()` after every mutations.
 */
@Injectable()
export class MikroFlushInterceptor implements NestInterceptor {
  constructor(private em: EntityManager) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const operation =
      GqlExecutionContext.create(context).getInfo<GraphQLResolveInfo>()
        .operation.operation;

    return next.handle().pipe(
      concatMap((value) => {
        return operation == 'mutation'
          ? from(this.em.flush()).pipe(map(() => value))
          : of(value);
      }),
    );
  }
}
