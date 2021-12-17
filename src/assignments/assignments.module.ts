import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Membership } from 'src/memberships/entities/membership.entity';
import { SharedModule } from 'src/shared/shared.module';
import { Task } from 'src/tasks/entities/task.entity';

import { AssignmentRefLoader } from './assignment-ref.loader';
import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';
import { AssignmentsFieldsResolver } from './assignments-fields.resolver';
import { Assignment } from './entities/assignment.entity';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([Assignment, Membership, Task]),
  ],
  providers: [
    AssignmentsResolver,
    AssignmentsFieldsResolver,
    AssignmentsService,
    AssignmentRefLoader,
  ],
  exports: [AssignmentsService, AssignmentRefLoader],
})
export class AssignmentsModule {}
