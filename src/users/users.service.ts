import { Injectable } from '@nestjs/common';
import { ServiceFactory } from 'src/service.factory';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends new ServiceFactory({
  entityClass: User,
  dtoClasses: { create: CreateUserDto, update: UpdateUserDto },
  lookupField: 'username',
}).product {}
