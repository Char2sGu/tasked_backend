import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Context } from 'src/context/context.class';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Repository } from 'src/mikro/repository.class';

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
    { limit, offset, isOwn }: QueryTasksArgs,
    query: FilterQuery<Task> = {},
  ) {
    const user = Context.current.user;
    return this.repo.findAndPaginate(
      { $and: [query, isOwn != undefined ? { creator: user } : {}] },
      {
        limit,
        offset,
        orderBy: { id: QueryOrder.DESC },
        filters: [CommonFilter.CRUD],
      },
    );
  }

  async queryOne({ id }: QueryTaskArgs) {
    return this.repo.findOneOrFail(id, { filters: [CommonFilter.CRUD] });
  }

  async createOne({ data }: CreateTaskArgs) {
    const user = Context.current.user;

    await this.memRepo.findOneOrFail(
      {
        owner: user,
        classroom: data.classroom,
      },
      {
        filters: [CommonFilter.CRUD],
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

  async updateOne({ id, data }: UpdateTaskArgs) {
    const user = Context.current.user;

    const task = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.CRUD],
    });

    if (task.creator != user)
      throw new ForbiddenException('Cannot update tasks not created by you');

    return task.assign(data);
  }

  async deleteOne({ id }: DeleteTaskArgs) {
    const user = Context.current.user;

    const task = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.CRUD],
    });

    if (task.creator != user)
      throw new ForbiddenException('Cannot delete tasks not created by you');

    await this.repo.populate(task, ['assignments']);
    return this.repo.delete(task);
  }
}
