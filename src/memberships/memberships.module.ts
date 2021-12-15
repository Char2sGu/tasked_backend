import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { SharedModule } from 'src/shared/shared.module';
import { TasksModule } from 'src/tasks/tasks.module';

import { Membership } from './entities/membership.entity';
import { MembershipsResolver } from './memberships.resolver';
import { MembershipsService } from './memberships.service';
import { MembershipsFieldsResolver } from './memberships-fields.resolver';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([Membership, Assignment]),
    forwardRef(() => AssignmentsModule),
    forwardRef(() => TasksModule),
  ],
  providers: [
    MembershipsResolver,
    MembershipsFieldsResolver,
    MembershipsService,
  ],
  exports: [MembershipsService],
})
export class MembershipsModule {}
