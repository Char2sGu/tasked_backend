import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject()
  authService: AuthService;

  async canActivate(_: ExecutionContext) {
    const context = GqlExecutionContext.create(_);
    const request = context.getContext<ExpressContext>().req;
    const token = this.authService.getJwtFromHeaders(request.headers);
    if (!token) throw new UnauthorizedException();
    const user = await this.authService.verifyJwt(token);
    if (!user) throw new UnauthorizedException();
    request.user = user;
    return true;
  }
}
