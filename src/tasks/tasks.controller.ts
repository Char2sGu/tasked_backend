import { Controller, UseGuards } from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

import { Task } from './entities/task.entity';
import { TasksAccessPolicy } from './tasks.access-policy';
import { TasksService } from './tasks.service';

@UseAccessPolicies(TasksAccessPolicy)
@UseGuards(JwtAuthGuard, AccessPolicyGuard)
@Controller()
export class TasksController extends new MikroCrudControllerFactory({
  serviceClass: TasksService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id', name: 'id' },
  queryDtoClass: new QueryDtoFactory<Task>({
    limit: { max: 200, default: 50 },
    offset: { max: 2000 },
  }).product,
  validationPipeOptions: {
    whitelist: true,
  },
}).product {}
