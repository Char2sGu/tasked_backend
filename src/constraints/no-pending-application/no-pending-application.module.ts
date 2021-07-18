import { forwardRef, Module } from '@nestjs/common';
import { JoinApplicationsModule } from 'src/join-applications/join-applications.module';
import { NoPendingApplicaitonConstraint } from './no-pending-application.constraint';

@Module({
  imports: [forwardRef(() => JoinApplicationsModule)],
  providers: [NoPendingApplicaitonConstraint],
  exports: [NoPendingApplicaitonConstraint],
})
export class NoPendingApplicationModule {}
