import {
  Body,
  Controller,
  Inject,
  Put,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthInfo } from './auth-info.interface';
import { AuthArgs } from './dto/auth.args';

@Controller()
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Put()
  async obtainToken(@Body() obtainTokenDto: AuthArgs): Promise<AuthInfo> {
    const token = await this.authService.obtainJwt(
      obtainTokenDto.username,
      obtainTokenDto.password,
    );
    if (!token) throw new UnauthorizedException('Invalid username or password');
    return { token };
  }
}
