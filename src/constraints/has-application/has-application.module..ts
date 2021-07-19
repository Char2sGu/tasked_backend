import { forwardRef, Module } from '@nestjs/common';
import { JoinApplicationsModule } from 'src/join-applications/join-applications.module';
import { HasApplicationConstraint } from './has-application.constraint';

@Module({
  imports: [forwardRef(() => JoinApplicationsModule)],
  providers: [HasApplicationConstraint],
  exports: [HasApplicationConstraint],
})
export class HasApplicationModule {}
