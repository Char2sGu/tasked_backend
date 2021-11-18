import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ContextInterceptor } from './context.interceptor';

@Module({})
export class ContextModule {
  static forRoot(): DynamicModule {
    return {
      module: ContextModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ContextInterceptor,
        },
      ],
    };
  }
}
