import { FilterQuery } from '@mikro-orm/core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/shared/crud.service';
import { User } from 'src/users/entities/user.entity';

import { CreateTaskArgs } from './dto/create-task.args';
import { DeleteTaskArgs } from './dto/delete-task.args';
import { QueryTaskArgs } from './dto/query-task.args';
import { QueryTasksArgs } from './dto/query-tasks.args';
import { UpdateTaskArgs } from './dto/update-task.args';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService extends CrudService.of(Task) {
  async queryMany(
    user: User,
    { limit, offset, isOwn }: QueryTasksArgs,
    query: FilterQuery<Task> = {},
  ) {
    return this.list(
      { $and: [query, isOwn != undefined ? { creator: user } : {}] },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  async queryOne(user: User, { id }: QueryTaskArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne(user: User, { data }: CreateTaskArgs) {
    return this.create({
      creator: user,
      ...data,
    });
  }

  async updateOne(user: User, { id, data }: UpdateTaskArgs) {
    const task = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (task.creator != user)
      throw new ForbiddenException('Cannot update tasks not created by you');

    return this.update(task, data);
  }

  async deleteOne(user: User, { id }: DeleteTaskArgs) {
    const task = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (task.creator != user)
      throw new ForbiddenException('Cannot delete tasks not created by you');

    return this.destroy(task);
  }
}
