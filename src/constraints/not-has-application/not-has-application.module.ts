import { Module } from '@nestjs/common';
import { HasApplicationModule } from '../has-application/has-application.module.';
import { NotHasApplicationConstraint } from './not-has-application.constraint';

@Module({
  imports: [HasApplicationModule],
  providers: [NotHasApplicationConstraint],
  exports: [NotHasApplicationConstraint],
})
export class NotHasApplicationModule {}
