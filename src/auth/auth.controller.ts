import {
  Body,
  Controller,
  Inject,
  Put,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthArgs } from './dto/auth.args';
import { AuthResult } from './dto/auth-result.dto';

@Controller()
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Put()
  async obtainToken(@Body() obtainTokenDto: AuthArgs): Promise<AuthResult> {
    const token = await this.authService.obtainJwt(
      obtainTokenDto.username,
      obtainTokenDto.password,
    );
    if (!token) throw new UnauthorizedException('Invalid username or password');
    return { token };
  }
}
