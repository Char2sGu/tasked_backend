import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CrudService } from 'src/crud/crud.service';
import { CRUD_FILTER } from 'src/crud/crud-filter.constant';

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
      { limit, offset, filters: { [CRUD_FILTER]: { user } } },
    );
  }

  async queryOne(user: User, { id }: QueryUserArgs) {
    return this.crud.retrieve(id, { filters: { [CRUD_FILTER]: { user } } });
  }

  async createOne({ data }: CreateUserArgs) {
    await this.crud.retrieve(
      { username: data.username },
      { failHandler: () => new BadRequestException('username must be unique') },
    );
    return this.crud.create(data);
  }

  async updateOne(user: User, { id, data }: UpdateUserArgs) {
    const entity = await this.crud.retrieve(id, {
      filters: { [CRUD_FILTER]: { user } },
    });

    if (entity != user)
      throw new ForbiddenException('Cannot update other users');
    if (entity.isUpdatedRecently)
      throw new ForbiddenException('Cannot update again within 3 days');

    return this.crud.update(id, data);
  }
}
