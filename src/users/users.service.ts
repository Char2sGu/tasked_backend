import { ForbiddenException, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends new MikroCrudServiceFactory({
  entityClass: User,
  dtoClasses: { create: CreateUserDto, update: UpdateUserDto },
}).product {
  async update({
    entity: targetUser,
    data,
    user,
  }: {
    entity: User;
    data: UpdateUserDto;
    user: User;
  }) {
    // forbid the user to update anyone except himself
    if (targetUser != user) throw new ForbiddenException();
    // forbid to update if updated recently
    if (targetUser.isUpdatedRecently) throw new ForbiddenException();
    return await super.update({ entity: targetUser, data, user });
  }
}
