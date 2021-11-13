import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { Request } from 'express';

import { ValidationContext } from './validation-context.interface';
import { ValidationContextAttached } from './validation-context-attached.dto';

/**
 * Attach context to `request.body._context` or `context.args.data._context`
 * for validation.
 *
 * > https://github.com/nestjs/nest/issues/528#issuecomment-497020970
 */
@Injectable()
export class ValidationContextInterceptor implements NestInterceptor {
  intercept(originalContext: ExecutionContext, next: CallHandler) {
    const context = this.getContext(originalContext);

    const data = this.getData(context);
    if (!data) return next.handle();

    const request = this.getRequest(context);
    const validationContext: ValidationContext = { user: request.user };
    data._context = validationContext;

    return next.handle();
  }

  getContext(
    context: ExecutionContext,
  ): GqlExecutionContext | HttpArgumentsHost {
    return context.getType<GqlContextType>() == 'graphql'
      ? GqlExecutionContext.create(context)
      : context.switchToHttp();
  }

  getData(
    context: GqlExecutionContext | HttpArgumentsHost,
  ): ValidationContextAttached | undefined {
    return context instanceof GqlExecutionContext
      ? context.getArgs().data
      : context.getRequest<Request>().body;
  }

  getRequest(context: GqlExecutionContext | HttpArgumentsHost) {
    return context instanceof GqlExecutionContext
      ? context.getContext<ExpressContext>().req
      : context.getRequest<Request>();
  }
}
