import { Module } from '@nestjs/common';

import { ExistenceConstraint } from '../validation/existence.constraint';

@Module({
  providers: [ExistenceConstraint],
  exports: [ExistenceConstraint],
})
export class SharedModule {}
