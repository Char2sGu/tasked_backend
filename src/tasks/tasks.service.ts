import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Membership } from 'src/memberships/entities/membership.entity';
import { CRUD_FILTER } from 'src/mikro/mikro-filters.constants';
import { Repository } from 'src/mikro/repository.class';
import { User } from 'src/users/entities/user.entity';

import { CreateTaskArgs } from './dto/create-task.args';
import { DeleteTaskArgs } from './dto/delete-task.args';
import { QueryTaskArgs } from './dto/query-task.args';
import { QueryTasksArgs } from './dto/query-tasks.args';
import { UpdateTaskArgs } from './dto/update-task.args';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    @InjectRepository(Membership) private memRepo: Repository<Membership>,
  ) {}

  async queryMany(
    user: User,
    { limit, offset, isOwn }: QueryTasksArgs,
    query: FilterQuery<Task> = {},
  ) {
    return this.repo.findAndPaginate(
      { $and: [query, isOwn != undefined ? { creator: user } : {}] },
      {
        limit,
        offset,
        orderBy: { id: QueryOrder.DESC },
        filters: [CRUD_FILTER],
      },
    );
  }

  async queryOne(user: User, { id }: QueryTaskArgs) {
    return this.repo.findOneOrFail(id, { filters: [CRUD_FILTER] });
  }

  async createOne(user: User, { data }: CreateTaskArgs) {
    await this.memRepo.findOneOrFail(
      {
        owner: user,
        classroom: data.classroom,
      },
      {
        filters: [CRUD_FILTER],
        failHandler: () =>
          new BadRequestException(
            'classroom must be an ID of a classroom having your membership',
          ),
      },
    );
    return this.repo.create({
      creator: user,
      isActive: true,
      ...data,
    });
  }

  async updateOne(user: User, { id, data }: UpdateTaskArgs) {
    const task = await this.repo.findOneOrFail(id, { filters: [CRUD_FILTER] });

    if (task.creator != user)
      throw new ForbiddenException('Cannot update tasks not created by you');

    return task.assign(data);
  }

  async deleteOne(user: User, { id }: DeleteTaskArgs) {
    const task = await this.repo.findOneOrFail(id, {
      filters: [CRUD_FILTER],
      populate: ['assignments'],
    });

    if (task.creator != user)
      throw new ForbiddenException('Cannot delete tasks not created by you');

    return this.repo.delete(task);
  }
}
