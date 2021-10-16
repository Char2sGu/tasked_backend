import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { CreateUserArgs } from './dto/create-user.args';
import { QueryUserArgs } from './dto/query-user.args';
import { QueryUsersArgs } from './dto/query-users.args';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends CrudService.of(User) {
  async queryMany(user: User, { limit, offset }: QueryUsersArgs) {
    return this.list({}, { limit, offset, filters: { visible: { user } } });
  }

  async queryOne(user: User, { id }: QueryUserArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne({ data }: CreateUserArgs) {
    return this.create(data);
  }

  async updateOne(user: User, { id, data }: UpdateUserArgs) {
    const entity = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (entity != user)
      throw new ForbiddenException('Cannot update other users');
    if (entity.isUpdatedRecently)
      throw new ForbiddenException('Cannot update again within 3 days');

    return this.update(id, data);
  }
}
