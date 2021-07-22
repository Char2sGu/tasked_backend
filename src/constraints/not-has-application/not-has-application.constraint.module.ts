import { Module } from '@nestjs/common';
import { HasApplicationConstraintModule } from '../has-application/has-application-constraint.module.';
import { NotHasApplicationConstraint } from './not-has-application.constraint';

@Module({
  imports: [HasApplicationConstraintModule],
  providers: [NotHasApplicationConstraint],
  exports: [NotHasApplicationConstraint],
})
export class NotHasApplicationConstraintModule {}
