import { EntityData } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';

import { TaskCreateInput } from './dto/task-create.input';
import { TaskUpdateInput } from './dto/task-update.input';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService extends new MikroCrudServiceFactory({
  entityClass: Task,
  dtoClasses: { create: TaskCreateInput, update: TaskUpdateInput },
}).product {
  @Inject()
  membershipsService: MembershipsService;

  async create({
    data,
    user,
  }: {
    data: TaskCreateInput | EntityData<Task>;
    user: User;
  }) {
    return await super.create({ data: { ...data, creator: user }, user });
  }
}
