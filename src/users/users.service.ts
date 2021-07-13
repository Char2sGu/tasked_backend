import { Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends new MikroCrudServiceFactory({
  entityClass: User,
  dtoClasses: { create: CreateUserDto, update: UpdateUserDto },
}).product {}
