import { Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';

import { UserCreateInput } from './dto/user-create.input';
import { UserUpdateInput } from './dto/user-update.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends new MikroCrudServiceFactory({
  entityClass: User,
  dtoClasses: { create: UserCreateInput, update: UserUpdateInput },
}).product {}
