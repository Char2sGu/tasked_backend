import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { ReqUser } from 'nest-mikro-crud/lib/decorators/req-user.decorator';
import { BodyContextInterceptor } from 'src/common/body-context.interceptor';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { SkipAuth } from 'src/common/skip-auth.decorator';

import { User } from './entities/user.entity';
import { UsersAccessPolicy } from './users.access-policy';
import { UsersService } from './users.service';

@UseAccessPolicies(UsersAccessPolicy)
@UseInterceptors(BodyContextInterceptor)
@UseGuards(JwtAuthGuard, AccessPolicyGuard)
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
).applyMethodDecorators('create', SkipAuth()).product {
  @Get('~current')
  current(@ReqUser() user: User) {
    return user;
  }
}
