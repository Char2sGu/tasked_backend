import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';

import { BodyContext } from './body-context.type';

/**
 * Attach context data into `request.body[CONTEXT_KEY]` for validation.
 * > https://github.com/nestjs/nest/issues/528#issuecomment-497020970
 */
@Injectable()
export class BodyContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const { user } = request;
    const bodyContext: BodyContext = { user };
    request.body._context = bodyContext;
    return next.handle();
  }
}
