import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { AUTH_GUARD_SKIP } from './auth-guard-skip.symbol';

/**
 * Prevent the endpoints from being accessed by unauthenticated users.
 *
 * Use {@link SkipAuth} to skip the check.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private auth: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.get<true | undefined>(
      AUTH_GUARD_SKIP,
      context.getHandler(),
    );

    if (!skipAuth) {
      const request = this.getRequest(context);
      const token = this.auth.getJwtFromHeaders(request.headers);
      const user = await this.auth.verifyJwt(token);
      request.user = user;
    }
    return true;
  }

  private getRequest(context: ExecutionContext) {
    return context.getType<GqlContextType>() == 'graphql'
      ? GqlExecutionContext.create(context).getContext<ExpressContext>().req
      : context.switchToHttp().getRequest<Request>();
  }
}
