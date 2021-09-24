import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { IncomingHttpHeaders } from 'node:http';
import { User } from 'src/users/entities/user.entity';

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
      const isValid = await bcryptjs.compare(password, user.password);
      if (isValid) return this.signJwt(user);
    } catch (error) {
      if (error instanceof NotFoundException) return;
      throw error;
    }
  }

  async verifyJwt(token: string) {
    try {
      const { id } = await this.jwtService.verifyAsync<JwtData>(token);
      return this.usersService.retrieve(id);
    } catch (error) {
      return;
    }
  }

  getJwtFromHeaders(headers: IncomingHttpHeaders): string | undefined {
    return headers.authorization?.slice(7); // `7` is the length of the prefix "Bearer "
  }

  private async signJwt(user: User) {
    const { id, username } = user;
    const data: JwtData = { id, username };
    return this.jwtService.signAsync(data);
  }
}

interface JwtData {
  id: number;
  username: string;
}
