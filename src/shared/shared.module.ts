import { Module } from '@nestjs/common';

import { ExistenceConstraint } from './existence.constraint';

@Module({
  providers: [ExistenceConstraint],
  exports: [ExistenceConstraint],
})
export class SharedModule {}
