import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { ROOT_PREFIX } from 'src/app.controller';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

export const PREFIX = `${ROOT_PREFIX}/users` as const;

@Controller(PREFIX)
export class UsersController extends new MikroCrudControllerFactory<UsersService>(
  {
    serviceClass: UsersService,
    actions: ['list', 'create', 'retrieve', 'update'],
    lookup: { field: 'username', type: 'string', name: 'username' },
    queryDtoClass: new QueryDtoFactory<User>({
      limit: { max: 200, default: 50 },
      offset: { max: 2000 },
    }).product,
  },
)
  .applyMethodDecorators('list', UseGuards(JwtAuthGuard))
  .applyMethodDecorators('retrieve', UseGuards(JwtAuthGuard))
  .applyMethodDecorators('update', UseGuards(JwtAuthGuard)).product {}
