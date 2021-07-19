import { Module } from '@nestjs/common';
import { HasMemberModule } from '../has-member/has-member.module';
import { NotHasMemberConstraint } from './not-has-member.constraint';

@Module({
  imports: [HasMemberModule],
  providers: [NotHasMemberConstraint],
  exports: [NotHasMemberConstraint],
})
export class NotHasMemberModule {}
