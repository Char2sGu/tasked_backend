import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'src/core/repository.class';
import { CRUD_FILTER } from 'src/crud/crud-filter.constant';

import { CreateUserArgs } from './dto/create-user.args';
import { QueryUserArgs } from './dto/query-user.args';
import { QueryUsersArgs } from './dto/query-users.args';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async queryMany(user: User, { limit, offset }: QueryUsersArgs) {
    return this.repo.find({}, { limit, offset, filters: [CRUD_FILTER] });
  }

  async queryOne(user: User, { id }: QueryUserArgs) {
    return this.repo.findOneOrFail(id, { filters: [CRUD_FILTER] });
  }

  async createOne({ data }: CreateUserArgs) {
    await this.repo.findOne({ username: data.username }).then((result) => {
      if (result) throw new BadRequestException('username must be unique');
    });
    return this.repo.create(data);
  }

  async updateOne(user: User, { id, data }: UpdateUserArgs) {
    const entity = await this.repo.findOneOrFail(id);

    if (entity != user)
      throw new ForbiddenException('Cannot update other users');

    if (entity.isUpdatedRecently)
      throw new ForbiddenException('Cannot update again within 3 days');

    return entity.assign(data);
  }
}
