import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';

import { Context } from './context.class';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  static storage = new AsyncLocalStorage<Context>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request =
      GqlExecutionContext.create(context).getContext<ExpressContext>().req;

    return new Observable((subscriber) => {
      ContextInterceptor.storage.run(new Context(request), () =>
        next.handle().subscribe(subscriber),
      );
    });
  }
}
