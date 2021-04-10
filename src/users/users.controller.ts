import { Controller, HttpCode, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ROOT_PREFIX } from 'src/app.controller';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

export const PREFIX = `${ROOT_PREFIX}/users`;

const decorators = [UseGuards(JwtAuthGuard)];

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
    getOneBase: { decorators },
    getManyBase: { decorators },
    updateOneBase: {
      decorators,
      allowParamsOverride: true, // allow the request to update `username`
      returnShallow: true, // return the updated entity directly instead of retrieving from the db again, 404 will be caused if set to `false`
    },
    deleteOneBase: {
      decorators: [...decorators, HttpCode(204)],
    },
  },
})
@Controller(PREFIX)
export class UsersController implements CrudController<User> {
  constructor(readonly service: UsersService) {}
}
