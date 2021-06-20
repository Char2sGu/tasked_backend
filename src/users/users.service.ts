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
    if (targetUser != user)
      throw new ForbiddenException('Updating other users is not allowed');
    if (targetUser.isUpdatedRecently)
      throw new ForbiddenException('Updating is not allowed within three days');
    return await super.update({ entity: targetUser, data, user });
  }
}
