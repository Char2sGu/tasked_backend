import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';

import { Membership } from './entities/membership.entity';
import { MembershipsAccessPolicy } from './memberships.access-policy';
import { MembershipsResolver } from './memberships.resolver';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [MikroOrmModule.forFeature([Membership]), AccessPolicyModule],
  providers: [MembershipsResolver, MembershipsService, MembershipsAccessPolicy],
  exports: [MembershipsService],
})
export class MembershipsModule {}
