import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ContextInterceptor } from './context.interceptor';
import { ContextService } from './context.service';

@Module({
  providers: [ContextService],
})
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

  static forFeature(): DynamicModule {
    return {
      module: ContextModule,
      providers: [ContextService],
      exports: [ContextService],
    };
  }
}
