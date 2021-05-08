import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import ms from 'ms';
import { TOKEN_VALIDITY_PERIOD } from 'src/constants';
import { EntityNotFoundError } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async obtainJwt(username: string, password: string) {
    try {
      const user = await this.usersService.retrieve(username, { expand: [] });
      if (await compare(password, user.password))
        return await this.jwtService.signAsync({ username });
    } catch (error) {
      if (error instanceof EntityNotFoundError) return;
      throw error;
    }
  }

  getExpirationDate(from = new Date()) {
    return new Date(from.getTime() + ms(TOKEN_VALIDITY_PERIOD));
  }
}
