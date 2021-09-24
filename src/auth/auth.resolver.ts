import { Inject, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SkipAuth } from 'src/common/auth/skip-auth.decorator';

import { AuthService } from './auth.service';
import { ObtainTokenArgs } from './dto/obtain-token.args';
import { ObtainTokenResult } from './dto/obtain-token-result.dto';

@Resolver()
export class AuthResolver {
  @Inject()
  private readonly service: AuthService;

  @SkipAuth()
  @Mutation(() => ObtainTokenResult)
  async obtainToken(@Args() { username, password }: ObtainTokenArgs) {
    const result = await this.service.obtainJwt(username, password);
    if (!result)
      throw new UnauthorizedException('Invalid username or password');
    return result;
  }
}
