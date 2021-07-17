import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsAccessPolicy } from './join-applications.access-policy';
import { JoinApplicationsController } from './join-applications.controller';
import { JoinApplicationsService } from './join-applications.service';
import { AsNonMember } from './validators/as-non-member.validator';
import { NoPendingApplicaiton } from './validators/no-pending-application.validator';

@Module({
  imports: [
    MikroOrmModule.forFeature([JoinApplication]),
    AccessPolicyModule,
    AuthModule,
    MembershipsModule,
  ],
  controllers: [JoinApplicationsController],
  providers: [
    JoinApplicationsService,
    JoinApplicationsAccessPolicy,
    AsNonMember,
    NoPendingApplicaiton,
  ],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
