import { Controller } from '@nestjs/common';
import { QueryDtoFactory, RestControllerFactory } from 'nest-restful';
import { ROOT_PREFIX } from 'src/app.controller';
import { SkipAuth } from 'src/auth/skip-auth.decorator';
import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from 'src/constants';
import { UsersService } from './users.service';

export const PREFIX = `${ROOT_PREFIX}/users`;

@Controller(PREFIX)
export class UsersController extends new RestControllerFactory({
  restServiceClass: UsersService,
  routes: ['list', 'create', 'retrieve', 'replace', 'update', 'destroy'],
  queryDto: new QueryDtoFactory({
    limit: { max: PAGINATION_MAX_LIMIT, default: PAGINATION_DEFAULT_LIMIT },
  }).product,
}).applyMethodDecorators('create', SkipAuth()).product {}
