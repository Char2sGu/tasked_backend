import { Module } from '@nestjs/common';
import { IsPrimaryKeyConstraint } from 'src/validation/is-primary-key.constraint';

import { ExistenceConstraint } from '../validation/existence.constraint';

@Module({
  providers: [ExistenceConstraint, IsPrimaryKeyConstraint],
  exports: [ExistenceConstraint, IsPrimaryKeyConstraint],
})
export class SharedModule {}
