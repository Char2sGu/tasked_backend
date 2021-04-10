import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SKIP_AUTH_METADATA_KEY } from './skip-auth.decorator';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skip = this.reflector.get<boolean>(
      SKIP_AUTH_METADATA_KEY,
      context.getHandler(),
    );
    if (skip) return true;
    return super.canActivate(context);
  }
}
