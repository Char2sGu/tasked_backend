import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from './users/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  /**
   * The JWT verifier function.
   *
   * It is hard to use DI in guards because all the modules which
   * uses this guard is required to import the dependencies, therefore
   * circular dependency may happen, which is difficult to solve
   * gracefully.
   */
  static verifyJwt: (token: string) => Promise<User>;

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token: string | undefined = request.headers.authorization?.slice(7); // `"Bearer xxxxxxxxxxxxxxxxxx..."`
    if (!token) throw new UnauthorizedException();
    const user = await JwtAuthGuard.verifyJwt(token);
    if (!user) throw new UnauthorizedException();
    request.user = user;
    return true;
  }
}
