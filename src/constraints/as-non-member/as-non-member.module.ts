import { forwardRef, Module } from '@nestjs/common';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { AsNonMemberConstraint } from './as-non-member.constraint';

@Module({
  imports: [forwardRef(() => MembershipsModule)],
  providers: [AsNonMemberConstraint],
  exports: [AsNonMemberConstraint],
})
export class AsNonMemberModule {}
