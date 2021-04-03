import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthInfo } from './auth-info.interface';
import { AuthService } from './auth.service';
import { ObtainTokenDto } from './dto/obtain-token.dto';

export const PREFIX = 'auth';

@Controller(PREFIX)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async obtainToken(@Body() obtainTokenDto: ObtainTokenDto): Promise<AuthInfo> {
    const token = await this.authService.obtainJwt(
      obtainTokenDto.username,
      obtainTokenDto.password,
    );
    if (!token) throw new UnauthorizedException();
    return {
      token,
      expiresAt: this.authService.getExpirationDate(),
    };
  }
}
