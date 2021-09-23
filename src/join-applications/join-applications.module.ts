import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { ExistenceConstraint } from 'src/common/validation/existence.constraint';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsAccessPolicy } from './join-applications.access-policy';
import { JoinApplicationsResolver } from './join-applications.resolver';
import { JoinApplicationsService } from './join-applications.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([JoinApplication]),
    AccessPolicyModule,
    MembershipsModule,
  ],
  providers: [
    JoinApplicationsResolver,
    JoinApplicationsService,
    JoinApplicationsAccessPolicy,
    ExistenceConstraint,
  ],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
