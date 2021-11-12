import { FilterQuery } from '@mikro-orm/core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/crud/crud.service';
import { CRUD_FILTER } from 'src/crud/crud-filter.constant';
import { User } from 'src/users/entities/user.entity';

import { CreateTaskArgs } from './dto/create-task.args';
import { DeleteTaskArgs } from './dto/delete-task.args';
import { QueryTaskArgs } from './dto/query-task.args';
import { QueryTasksArgs } from './dto/query-tasks.args';
import { UpdateTaskArgs } from './dto/update-task.args';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(public crud: CrudService<Task>) {}

  async queryMany(
    user: User,
    { limit, offset, isOwn }: QueryTasksArgs,
    query: FilterQuery<Task> = {},
  ) {
    return this.crud.list(
      { $and: [query, isOwn != undefined ? { creator: user } : {}] },
      { limit, offset, filters: { [CRUD_FILTER]: user } },
    );
  }

  async queryOne(user: User, { id }: QueryTaskArgs) {
    return this.crud.retrieve(id, { filters: { [CRUD_FILTER]: user } });
  }

  async createOne(user: User, { data }: CreateTaskArgs) {
    return this.crud.create({
      creator: user,
      ...data,
    });
  }

  async updateOne(user: User, { id, data }: UpdateTaskArgs) {
    const task = await this.crud.retrieve(id, {
      filters: { [CRUD_FILTER]: user },
    });

    if (task.creator != user)
      throw new ForbiddenException('Cannot update tasks not created by you');

    return this.crud.update(task, data);
  }

  async deleteOne(user: User, { id }: DeleteTaskArgs) {
    const task = await this.crud.retrieve(id, {
      filters: { [CRUD_FILTER]: user },
    });

    if (task.creator != user)
      throw new ForbiddenException('Cannot delete tasks not created by you');

    return this.crud.destroy(task);
  }
}
