import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';

import { Task } from './entities/task.entity';
import { TasksAccessPolicy } from './tasks.access-policy';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  imports: [MikroOrmModule.forFeature([Task]), AccessPolicyModule],
  providers: [TasksResolver, TasksService, TasksAccessPolicy],
  exports: [TasksService],
})
export class TasksModule {}
