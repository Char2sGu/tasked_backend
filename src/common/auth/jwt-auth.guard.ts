import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { Request } from 'express';

import { AuthService } from '../../auth/auth.service';
import { SKIP_AUTH } from './skip-auth.symbol';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject()
  authService: AuthService;

  @Inject()
  reflector: Reflector;

  async canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.get<true | undefined>(
      SKIP_AUTH,
      context.getHandler(),
    );

    if (!skipAuth) {
      const request = this.getRequest(context);
      const token = this.authService.getJwtFromHeaders(request.headers);
      if (!token) throw new UnauthorizedException();
      const user = await this.authService.verifyJwt(token);
      if (!user) throw new UnauthorizedException();
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
