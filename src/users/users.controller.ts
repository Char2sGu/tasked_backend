import {
  applyDecorators,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { ReqUser } from 'nest-mikro-crud/lib/decorators/req-user.decorator';
import { BodyContextInterceptor } from 'src/common/body-context.interceptor';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

import { User } from './entities/user.entity';
import { UsersAccessPolicy } from './users.access-policy';
import { UsersService } from './users.service';

const Protected = () =>
  applyDecorators(UseGuards(JwtAuthGuard, AccessPolicyGuard));

@UseAccessPolicies(UsersAccessPolicy)
@UseInterceptors(BodyContextInterceptor)
@Controller()
export class UsersController extends new MikroCrudControllerFactory<UsersService>(
  {
    serviceClass: UsersService,
    actions: ['list', 'create', 'retrieve', 'update'],
    lookup: { field: 'username', type: 'string', name: 'username' },
    queryDtoClass: new QueryDtoFactory<User>({
      limit: { max: 200, default: 50 },
      offset: { max: 2000 },
    }).product,
    validationPipeOptions: {
      whitelist: true,
    },
  },
)
  .applyMethodDecorators('list', Protected())
  .applyMethodDecorators('update', Protected()).product {
  @Protected()
  @Get('~current')
  current(@ReqUser() user: User) {
    return user;
  }
}
