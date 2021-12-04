import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule as ThrottlerModuleBase } from '@nestjs/throttler';

import { ThrottlerGuard } from './throttler.guard';

@Module({})
export class ThrottlerModule {
  static forRoot(ttl: number, limit: number): DynamicModule {
    return {
      module: ThrottlerModule,
      imports: [ThrottlerModuleBase.forRoot({ ttl, limit })],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    };
  }
}
