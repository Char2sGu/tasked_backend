import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard as ThrottlerGuardBase } from '@nestjs/throttler';
import { ExpressContext } from 'apollo-server-express';

@Injectable()
export class ThrottlerGuard extends ThrottlerGuardBase implements CanActivate {
  getRequestResponse(context: ExecutionContext) {
    const req =
      GqlExecutionContext.create(context).getContext<ExpressContext>().req;
    return { req, res: req.res };
  }
}
