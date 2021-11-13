import { Module } from '@nestjs/common';

import { ExistenceConstraint } from './existence.constraint';
import { IsPrimaryKeyConstraint } from './is-primary-key.constraint';

@Module({
  providers: [ExistenceConstraint, IsPrimaryKeyConstraint],
  exports: [ExistenceConstraint, IsPrimaryKeyConstraint],
})
export class ValidationModule {}
