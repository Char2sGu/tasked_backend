import { Inject, UnauthorizedException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { SkipAuth } from 'src/common/auth/skip-auth.decorator';

import { AuthService } from './auth.service';
import { QueryTokenArgs } from './dto/query-token.args';

@Resolver()
export class AuthResolver {
  @Inject()
  private readonly service: AuthService;

  @SkipAuth()
  @Query(() => String, {
    name: 'token',
  })
  async queryToken(@Args() { username, password }: QueryTokenArgs) {
    const result = await this.service.obtainJwt(username, password);
    if (!result)
      throw new UnauthorizedException('Invalid username or password');
    return result.token;
  }
}
