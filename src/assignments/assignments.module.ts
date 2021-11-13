import { forwardRef, Module } from '@nestjs/common';
import { CrudModule } from 'src/crud/crud.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { SharedModule } from 'src/shared/shared.module';
import { TasksModule } from 'src/tasks/tasks.module';

import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';
import { AssignmentsFieldsResolver } from './assignments-fields.resolver';
import { Assignment } from './entities/assignment.entity';

@Module({
  imports: [
    SharedModule,
    CrudModule.forFeature(Assignment),
    forwardRef(() => MembershipsModule),
    forwardRef(() => TasksModule),
  ],
  providers: [
    AssignmentsResolver,
    AssignmentsFieldsResolver,
    AssignmentsService,
  ],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
