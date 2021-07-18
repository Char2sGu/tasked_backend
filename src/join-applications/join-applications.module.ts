import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AuthModule } from 'src/auth/auth.module';
import { AsNonMemberModule } from 'src/constraints/as-non-member/as-non-member.module';
import { NoPendingApplicationModule } from 'src/constraints/no-pending-application/no-pending-application.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsAccessPolicy } from './join-applications.access-policy';
import { JoinApplicationsController } from './join-applications.controller';
import { JoinApplicationsService } from './join-applications.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([JoinApplication]),
    AccessPolicyModule,
    AuthModule,
    MembershipsModule,
    forwardRef(() => AsNonMemberModule),
    forwardRef(() => NoPendingApplicationModule),
  ],
  controllers: [JoinApplicationsController],
  providers: [JoinApplicationsService, JoinApplicationsAccessPolicy],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
