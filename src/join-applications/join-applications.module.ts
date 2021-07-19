import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AuthModule } from 'src/auth/auth.module';
import { NotHasApplicationModule } from 'src/constraints/not-has-application/not-has-application.module';
import { NotHasMemberModule } from 'src/constraints/not-has-member/not-has-member.module';
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
    NotHasMemberModule,
    NotHasApplicationModule,
  ],
  controllers: [JoinApplicationsController],
  providers: [JoinApplicationsService, JoinApplicationsAccessPolicy],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
