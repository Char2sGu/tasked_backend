import { Inject, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuardSkip } from 'src/auth/auth-guard-skip.decorator';

import { AuthService } from './auth.service';
import { AuthResult } from './dto/auth-result.dto';
import { QueryTokenArgs } from './dto/query-token.args';

@Resolver()
export class AuthResolver {
  @Inject()
  private service: AuthService;

  @AuthGuardSkip()
  @Mutation(() => AuthResult, {
    name: 'auth',
  })
  async auth(@Args() { username, password }: QueryTokenArgs) {
    const result = await this.service.obtainJwt(username, password);
    if (!result)
      throw new UnauthorizedException('Invalid username or password');
    return result;
  }
}
