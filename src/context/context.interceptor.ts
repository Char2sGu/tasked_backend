import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { Observable } from 'rxjs';

import { Context } from './context.class';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request =
      GqlExecutionContext.create(context).getContext<ExpressContext>().req;

    return new Context(request).apply(() => next.handle());
  }
}
