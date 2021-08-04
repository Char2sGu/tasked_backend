import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { BodyContextInterceptor } from 'src/body-context.interceptor';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersAccessPolicy } from './users.access-policy';
import { UsersService } from './users.service';

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
  .applyMethodDecorators('list', UseGuards(JwtAuthGuard, AccessPolicyGuard))
  .applyMethodDecorators('retrieve', UseGuards(JwtAuthGuard, AccessPolicyGuard))
  .applyMethodDecorators('update', UseGuards(JwtAuthGuard, AccessPolicyGuard))
  .product {}
