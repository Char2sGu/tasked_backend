import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { FlushDbInterceptor } from './flush-db.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: FlushDbInterceptor,
    },
  ],
})
export class CoreModule {}
