import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { AccessPolicyGuard } from 'nest-access-policy';

export class GqlAccessPolicyGuard extends AccessPolicyGuard {
  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);

    const request = gqlContext.getContext<ExpressContext>().req;
    request.params = gqlContext.getArgs();

    const httpArgumentsHost = context.switchToHttp();
    httpArgumentsHost.getRequest = () => request as any;

    context.switchToHttp = () => httpArgumentsHost;

    return super.canActivate(context);
  }
}
