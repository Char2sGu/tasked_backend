import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';

import { AuthService } from '../auth/auth.service';
import { SKIP_AUTH } from './skip-auth.symbol';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject()
  authService: AuthService;

  @Inject()
  reflector: Reflector;

  async canActivate(_: ExecutionContext) {
    const context = GqlExecutionContext.create(_);

    const skipAuth = this.reflector.get<true | undefined>(
      SKIP_AUTH,
      context.getHandler(),
    );
    if (!skipAuth) {
      const request = context.getContext<ExpressContext>().req;
      const token = this.authService.getJwtFromHeaders(request.headers);
      if (!token) throw new UnauthorizedException();
      const user = await this.authService.verifyJwt(token);
      if (!user) throw new UnauthorizedException();
      request.user = user;
    }
    return true;
  }
}
