import { NotFoundError } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    JwtAuthGuard.verifyJwt = this.verifyJwt.bind(this) as this['verifyJwt'];
  }

  async obtainJwt(username: string, password: string) {
    try {
      const user = await this.usersService.retrieve({
        conditions: { username },
      });
      if (await compare(password, user.password))
        return await this.jwtService.signAsync({ username });
    } catch (error) {
      if (error instanceof NotFoundError) return;
      throw error;
    }
  }

  async verifyJwt(token: string) {
    try {
      const { username } = await this.jwtService.verifyAsync<{
        username: string;
      }>(token);
      return await this.usersService.retrieve({ conditions: { username } });
    } catch (error) {
      return;
    }
  }
}
