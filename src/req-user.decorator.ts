import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequest } from './express.interface';

export const ReqUser = createParamDecorator<string, ExecutionContext>(
  (data, context) => {
    const request: ExpressRequest = context.switchToHttp().getRequest();
    return request.user;
  },
);
