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
    entity: targetUser,
    user,
  }: {
    action: ActionName;
    entity?: User;
    user?: User;
  }) {
    if (targetUser) {
      if (action == 'replace' || action == 'update') {
        // forbid the user to update anyone except himself
        if (targetUser.id != user.id) throw new ForbiddenException();
        // forbid to update if updated recently
        if (!targetUser.isUpdatedRecently) throw new ForbiddenException();
      }
    }
  }
}
