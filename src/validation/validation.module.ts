import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { IsPrimaryKeyConstraint } from './is-primary-key.constraint';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          exposeDefaultValues: true, // `@Field(..., { defaultValue: ... })` cannot work in `@ResolveField()` (Bug)
          exposeUnsetFields: false, // if `true`, update actions will unexpectedly assign an `undefined` value to the entity fields and cause error
        },
        whitelist: true,
      }),
    },
    IsPrimaryKeyConstraint,
  ],
  exports: [IsPrimaryKeyConstraint],
})
export class ValidationModule {}
