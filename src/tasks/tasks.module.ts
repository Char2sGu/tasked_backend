import { forwardRef, Module } from '@nestjs/common';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { CrudModule } from 'src/crud/crud.module';
import { SharedModule } from 'src/shared/shared.module';

import { Task } from './entities/task.entity';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { TasksFieldsResolver } from './tasks-fields.resolver';

@Module({
  imports: [
    SharedModule,
    CrudModule.forFeature(Task),
    forwardRef(() => AssignmentsModule),
  ],
  providers: [TasksResolver, TasksFieldsResolver, TasksService],
  exports: [TasksService],
})
export class TasksModule {}
