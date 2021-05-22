import { ForbiddenException, Injectable } from '@nestjs/common';
import { ActionName, RestServiceFactory } from 'nest-restful';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends new RestServiceFactory({
  entityClass: User,
  dtoClasses: { create: CreateUserDto, update: UpdateUserDto },
  lookupField: 'username',
}).product {
  async checkPermission({
    action,
    entity,
    user,
  }: {
    action: ActionName;
    entity?: User;
    user?: User;
  }) {
    if (entity) {
      if (action == 'replace' || action == 'update') {
        if (entity.id != user.id) throw new ForbiddenException();
        if (!entity.isRecentUpdated) throw new ForbiddenException();
      }
    }
  }
}
