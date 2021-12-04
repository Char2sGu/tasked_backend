import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule as ThrottlerModuleBase } from '@nestjs/throttler';

import { ThrottlerGuard } from './throttler.guard';

@Module({})
export class ThrottlerModule {
  static forRoot(): DynamicModule {
    return {
      module: ThrottlerModule,
      imports: [
        ThrottlerModuleBase.forRoot({
          ttl: 60,
          limit: 60,
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    };
  }
}
