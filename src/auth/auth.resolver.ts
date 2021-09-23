import { Inject, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SkipAuth } from 'src/common/auth/skip-auth.decorator';

import { AuthService } from './auth.service';
import { AuthArgs } from './dto/auth.args';
import { AuthResult } from './dto/auth-result.dto';

@Resolver()
export class AuthResolver {
  @Inject()
  private readonly service: AuthService;

  @SkipAuth()
  @Mutation(() => AuthResult)
  async obtainToken(
    @Args() { username, password }: AuthArgs,
  ): Promise<AuthResult> {
    const token = await this.service.obtainJwt(username, password);
    if (!token) throw new UnauthorizedException('Invalid username or password');
    return { token };
  }
}
