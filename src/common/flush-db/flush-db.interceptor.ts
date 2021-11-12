import { EntityManager } from '@mikro-orm/sqlite';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { concatMap, from, map, Observable, of } from 'rxjs';

import { FLUSH_DB_REQUIRED } from './flush-db-required.symbol';

/**
 * Flush mikro-orm database changes by calling EntityManager.flush() after
 * each routing method applied a {@link FlushDb @FlushDb()} is over.
 */
@Injectable()
export class FlushDbInterceptor implements NestInterceptor {
  @Inject()
  private em: EntityManager;

  @Inject()
  private reflector: Reflector;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      concatMap((value) => {
        const required: true | undefined = this.reflector.get(
          FLUSH_DB_REQUIRED,
          context.getHandler(),
        );
        return required
          ? from(this.em.flush()).pipe(map(() => value))
          : of(value);
      }),
    );
  }
}
