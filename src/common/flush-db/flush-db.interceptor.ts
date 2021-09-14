import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

import { DB_FLUSHER } from './db-flusher.symbol';
import { FLUSH_DB } from './flush-db.symbol';

@Injectable()
export class FlushDbInterceptor implements NestInterceptor {
  @Inject()
  moduleRef: ModuleRef;

  @Inject()
  reflector: Reflector;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (value) => {
        const ifFlush = this.reflector.get<true | undefined>(
          FLUSH_DB,
          context.getHandler(),
        );
        if (ifFlush) await this.getFlusher(context.getClass()).flush();
        return value;
      }),
    );
  }

  private getFlusher(classRef: Type) {
    const token = this.reflector.get<string | symbol | Type>(
      DB_FLUSHER,
      classRef,
    );
    if (!token)
      throw new Error('@Flusher() must be applied when applied @Flush()');
    const flusher = this.moduleRef.get<{ flush(): Promise<void> }>(token, {
      strict: false,
    });
    return flusher;
  }
}
