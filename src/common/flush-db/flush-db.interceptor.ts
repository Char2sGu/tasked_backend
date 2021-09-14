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

@Injectable()
export class FlushDbInterceptor implements NestInterceptor {
  @Inject()
  em: EntityManager;

  @Inject()
  reflector: Reflector;

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
