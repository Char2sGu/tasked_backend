import { NotFoundError } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { IncomingHttpHeaders } from 'node:http';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  @Inject()
  private readonly usersService: UsersService;

  @Inject()
  private readonly jwtService: JwtService;

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

  getJwtFromHeaders(headers: IncomingHttpHeaders): string | undefined {
    return headers.authorization?.slice(7); // `7` is the length of the prefix "Bearer "
  }
}
