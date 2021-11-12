import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';
import { AssignmentsFieldsResolver } from './assignments-fields.resolver';
import { IsInferiorMemberConstraint } from './dto/is-inferior-member.constraint';
import { Assignment } from './entities/assignment.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Assignment]), MembershipsModule],
  providers: [
    AssignmentsResolver,
    AssignmentsFieldsResolver,
    AssignmentsService,
    IsInferiorMemberConstraint,
  ],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
