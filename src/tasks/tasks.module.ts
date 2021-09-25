import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AssignmentsModule } from 'src/assignments/assignments.module';

import { Task } from './entities/task.entity';
import { TasksAccessPolicy } from './tasks.access-policy';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Task]),
    AccessPolicyModule,
    forwardRef(() => AssignmentsModule),
  ],
  providers: [TasksResolver, TasksService, TasksAccessPolicy],
  exports: [TasksService],
})
export class TasksModule {}
