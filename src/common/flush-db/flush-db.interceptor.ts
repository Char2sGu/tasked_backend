import { EntityManager } from '@mikro-orm/sqlite';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

import { FLUSH_DB } from './flush-db.symbol';

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
      map(async (value) => {
        const ifFlush = this.reflector.get<true | undefined>(
          FLUSH_DB,
          context.getHandler(),
        );
        if (ifFlush) await this.em.flush();
        return value;
      }),
    );
  }
}
