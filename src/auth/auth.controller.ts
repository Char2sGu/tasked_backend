import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthInfo } from './auth-info.interface';
import { AuthService } from './auth.service';
import { ObtainTokenDto } from './dto/obtain-token.dto';

@Controller()
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Post()
  async obtainToken(@Body() obtainTokenDto: ObtainTokenDto): Promise<AuthInfo> {
    const token = await this.authService.obtainJwt(
      obtainTokenDto.username,
      obtainTokenDto.password,
    );
    if (!token) throw new UnauthorizedException('Invalid username or password');
    return { token };
  }
}
