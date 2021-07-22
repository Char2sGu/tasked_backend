import { Module } from '@nestjs/common';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { HasMemberConstraint } from './has-member.constraint';

@Module({
  imports: [MembershipsModule],
  providers: [HasMemberConstraint],
  exports: [HasMemberConstraint],
})
export class HasMemberConstraintModule {}
