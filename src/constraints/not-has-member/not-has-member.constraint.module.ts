import { Module } from '@nestjs/common';
import { HasMemberConstraintModule } from '../has-member/has-member-constraint.module';
import { NotHasMemberConstraint } from './not-has-member.constraint';

@Module({
  imports: [HasMemberConstraintModule],
  providers: [NotHasMemberConstraint],
  exports: [NotHasMemberConstraint],
})
export class NotHasMemberConstraintModule {}
