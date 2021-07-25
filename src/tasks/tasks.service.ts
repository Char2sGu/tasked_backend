import { EntityData } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService extends new MikroCrudServiceFactory({
  entityClass: Task,
  dtoClasses: { create: CreateTaskDto, update: UpdateTaskDto },
}).product {
  @Inject()
  membershipsService: MembershipsService;

  async create({
    data,
    user,
  }: {
    data: CreateTaskDto | EntityData<Task>;
    user: User;
  }) {
    return await super.create({ data: { ...data, creator: user }, user });
  }
}
