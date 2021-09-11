import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AuthModule } from 'src/auth/auth.module';

import { Membership } from './entities/membership.entity';
import { MembershipsAccessPolicy } from './memberships.access-policy';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Membership]),
    AccessPolicyModule,
    AuthModule,
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsAccessPolicy],
  exports: [MembershipsService],
})
export class MembershipsModule {}
