import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';

import { BodyContext } from './body-context.type';

/**
 * Attach context data into `request.body[CONTEXT_KEY]` for validation.
 * > https://github.com/nestjs/nest/issues/528#issuecomment-497020970
 */
@Injectable()
export class BodyContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = this.getRequest(context);
    const { user } = request;
    const bodyContext: BodyContext = { user };
    request.body._context = bodyContext;
    return next.handle();
  }

  private getRequest(context: ExecutionContext) {
    return context.getType<GqlContextType>() == 'graphql'
      ? GqlExecutionContext.create(context).getContext<ExpressContext>().req
      : context.switchToHttp().getRequest();
  }
}
