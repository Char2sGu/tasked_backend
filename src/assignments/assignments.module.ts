import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { AssignmentsAccessPolicy } from './assignments.access-policy';
import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';
import { IsInferiorMemberConstraint } from './dto/is-inferior-member.constraint';
import { Assignment } from './entities/assignment.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Assignment]),
    AccessPolicyModule,
    MembershipsModule,
  ],
  providers: [
    AssignmentsResolver,
    AssignmentsService,
    AssignmentsAccessPolicy,
    IsInferiorMemberConstraint,
  ],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
