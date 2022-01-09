import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule as ThrottlerModuleBase } from '@nestjs/throttler';
import { THROTTLER_LIMIT, THROTTLER_TTL } from 'src/env.constants';

import { ThrottlerGuard } from './throttler.guard';

@Module({})
export class ThrottlerModule {
  static forRoot(): DynamicModule {
    return {
      module: ThrottlerModule,
      imports: [
        ThrottlerModuleBase.forRoot({
          ttl: THROTTLER_TTL,
          limit: THROTTLER_LIMIT,
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
