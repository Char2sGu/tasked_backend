import { forwardRef, Module } from '@nestjs/common';
import { ExistenceConstraint } from 'src/common/validation/existence.constraint';
import { CrudModule } from 'src/crud/crud.module';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsResolver } from './join-applications.resolver';
import { JoinApplicationsService } from './join-applications.service';
import { JoinApplicationsFieldsResolver } from './join-applications-fields.resolver';

@Module({
  imports: [
    CrudModule.forFeature(JoinApplication),
    forwardRef(() => MembershipsModule),
  ],
  providers: [
    JoinApplicationsResolver,
    JoinApplicationsFieldsResolver,
    JoinApplicationsService,
    ExistenceConstraint,
  ],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
