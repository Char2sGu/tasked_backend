import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
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
      const user = await this.usersService.retrieve({ username });
      if (await bcryptjs.compare(password, user.password))
        return await this.jwtService.signAsync({ username });
    } catch (error) {
      if (error instanceof NotFoundException) return;
      throw error;
    }
  }

  async verifyJwt(token: string) {
    try {
      const { username } = await this.jwtService.verifyAsync<{
        username: string;
      }>(token);
      return await this.usersService.retrieve({ username });
    } catch (error) {
      return;
    }
  }

  getJwtFromHeaders(headers: IncomingHttpHeaders): string | undefined {
    return headers.authorization?.slice(7); // `7` is the length of the prefix "Bearer "
  }
}
