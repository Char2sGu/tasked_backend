import { Controller, HttpCode } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ROOT_PREFIX } from 'src/app.controller';
import { SkipAuth } from 'src/auth/skip-auth.decorator';
import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

export const PREFIX = `${ROOT_PREFIX}/users`;

@Crud({
  model: { type: User },
  dto: { create: CreateUserDto, update: UpdateUserDto, replace: UpdateUserDto },
  query: {
    alwaysPaginate: true,
    limit: PAGINATION_DEFAULT_LIMIT,
    maxLimit: PAGINATION_MAX_LIMIT,
    filter: undefined, // disable filtering temporary
  },
  params: {
    username: {
      field: 'username',
      type: 'string',
      primary: true,
    },
  },
  routes: {
    only: [
      'createOneBase',
      'getOneBase',
      'getManyBase',
      'updateOneBase',
      'deleteOneBase',
    ],
    createOneBase: { decorators: [SkipAuth()] },
    updateOneBase: {
      allowParamsOverride: true, // allow the request to update `username`
      returnShallow: true, // return the updated entity directly instead of retrieving from the db again, 404 will be caused if set to `false`
    },
    deleteOneBase: { decorators: [HttpCode(204)] },
  },
})
@Controller(PREFIX)
export class UsersController implements CrudController<User> {
  constructor(readonly service: UsersService) {}
}
