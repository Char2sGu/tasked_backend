import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async obtainJwt(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && (await compare(password, user.password)))
      return await this.jwtService.signAsync({ username });
  }

  getExpirationDate(from = new Date()) {
    return new Date(
      from.getTime() + 1000 * 60 * 60 * Number(process.env.TOKEN_EXPIRY),
    );
  }
}
