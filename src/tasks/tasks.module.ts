import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { SharedModule } from 'src/shared/shared.module';

import { Task } from './entities/task.entity';
import { TaskRefLoader } from './task-ref.loader';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { TasksFieldsResolver } from './tasks-fields.resolver';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([Task, Membership]),
    forwardRef(() => AssignmentsModule),
    forwardRef(() => MembershipsModule),
  ],
  providers: [TasksResolver, TasksFieldsResolver, TasksService, TaskRefLoader],
  exports: [TasksService, TaskRefLoader],
})
export class TasksModule {}
