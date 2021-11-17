import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { IsPrimaryKeyConstraint } from './is-primary-key.constraint';
import { ValidationPipe } from './validation.pipe';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    IsPrimaryKeyConstraint,
  ],
  exports: [IsPrimaryKeyConstraint],
})
export class ValidationModule {}
