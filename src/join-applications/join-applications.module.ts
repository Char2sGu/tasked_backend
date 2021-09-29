import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ExistenceConstraint } from 'src/common/validation/existence.constraint';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsResolver } from './join-applications.resolver';
import { JoinApplicationsService } from './join-applications.service';

@Module({
  imports: [MikroOrmModule.forFeature([JoinApplication]), MembershipsModule],
  providers: [
    JoinApplicationsResolver,
    JoinApplicationsService,
    ExistenceConstraint,
  ],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
