import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Membership } from './entities/membership.entity';
import { MembershipsResolver } from './memberships.resolver';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [MikroOrmModule.forFeature([Membership])],
  providers: [MembershipsResolver, MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
