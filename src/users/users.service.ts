import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/crud/crud.service';

import { CreateUserArgs } from './dto/create-user.args';
import { QueryUserArgs } from './dto/query-user.args';
import { QueryUsersArgs } from './dto/query-users.args';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(public crud: CrudService<User>) {}

  async queryMany(user: User, { limit, offset }: QueryUsersArgs) {
    return this.crud.list(
      {},
      { limit, offset, filters: { visible: { user } } },
    );
  }

  async queryOne(user: User, { id }: QueryUserArgs) {
    return this.crud.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne({ data }: CreateUserArgs) {
    return this.crud.create(data);
  }

  async updateOne(user: User, { id, data }: UpdateUserArgs) {
    const entity = await this.crud.retrieve(id, {
      filters: { visible: { user } },
    });

    if (entity != user)
      throw new ForbiddenException('Cannot update other users');
    if (entity.isUpdatedRecently)
      throw new ForbiddenException('Cannot update again within 3 days');

    return this.crud.update(id, data);
  }
}
