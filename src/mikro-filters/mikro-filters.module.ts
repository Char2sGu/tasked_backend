import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { MikroFiltersInterceptor } from './mikro-filters.interceptor';

@Module({})
export class MikroFiltersModule {
  static forRoot(): DynamicModule {
    return {
      module: MikroFiltersModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: MikroFiltersInterceptor,
        },
      ],
    };
  }
}
