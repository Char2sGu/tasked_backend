import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { FlushDbInterceptor } from './flush-db.interceptor';

/**
 * Provide core providers and should only be imported in the {@link AppModule}.
 */
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: FlushDbInterceptor,
    },
  ],
})
export class CoreModule {}
