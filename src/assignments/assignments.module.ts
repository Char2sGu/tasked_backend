import { forwardRef, Module } from '@nestjs/common';
import { CrudModule } from 'src/crud/crud.module';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';
import { AssignmentsFieldsResolver } from './assignments-fields.resolver';
import { Assignment } from './entities/assignment.entity';

@Module({
  imports: [
    CrudModule.forFeature(Assignment),
    forwardRef(() => MembershipsModule),
  ],
  providers: [
    AssignmentsResolver,
    AssignmentsFieldsResolver,
    AssignmentsService,
  ],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
