import { Module, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ExistenceConstraint } from './existence.constraint';
import { IsPrimaryKeyConstraint } from './is-primary-key.constraint';
import { ValidationContextInterceptor } from './validation-context.interceptor';

@Module({
  providers: [
    ExistenceConstraint,
    IsPrimaryKeyConstraint,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationContextInterceptor,
    },
  ],
  exports: [ExistenceConstraint, IsPrimaryKeyConstraint],
})
export class ValidationModule {}
