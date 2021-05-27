import { Controller, UseGuards } from '@nestjs/common';
import { QueryDtoFactory, RestControllerFactory } from 'nest-restful';
import { ROOT_PREFIX } from 'src/app.controller';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ReqUser } from 'src/req-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

export const PREFIX = `${ROOT_PREFIX}/users`;

@Controller(PREFIX)
export class UsersController extends new RestControllerFactory({
  restServiceClass: UsersService,
  actions: ['list', 'create', 'retrieve', 'replace', 'update', 'destroy'],
  queryDto: new QueryDtoFactory({
    limit: { max: 100, default: 50 },
  }).product,
  contextOptions: {
    user: { type: User, decorators: [ReqUser()] },
  },
})
  .applyMethodDecorators('list', UseGuards(JwtAuthGuard))
  .applyMethodDecorators('retrieve', UseGuards(JwtAuthGuard))
  .applyMethodDecorators('replace', UseGuards(JwtAuthGuard))
  .applyMethodDecorators('update', UseGuards(JwtAuthGuard)).product {}
