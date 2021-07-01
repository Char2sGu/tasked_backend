import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject()
  authService: AuthService;

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.authService.getJwtFromHeaders(request.headers);
    if (!token) throw new UnauthorizedException();
    const user = await this.authService.verifyJwt(token);
    if (!user) throw new UnauthorizedException();
    request.user = user;
    return true;
  }
}
