import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import depthLimit from 'graphql-depth-limit';
import {
  DEBUG,
  MAX_COMPLEXITY,
  MAX_DEPTH,
  THROTTLER_LIMIT,
  THROTTLER_TTL,
} from 'src/env.constants';

import { GraphqlComplexityPlugin } from './graphql-complexity.plugin';
import { GRAPHQL_COMPLEXITY_MAX } from './graphql-complexity-max.token';
import { GraphqlThrottlerGuard } from './graphql-throttler.guard';

@Module({})
export class GraphqlModule {
  static forRoot(): DynamicModule {
    return {
      module: GraphqlModule,
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          playground: DEBUG,
          validationRules: [depthLimit(MAX_DEPTH)],
        }),
        ThrottlerModule.forRoot({
          ttl: THROTTLER_TTL,
          limit: THROTTLER_LIMIT,
        }),
      ],
      providers: [
        GraphqlComplexityPlugin,
        { provide: GRAPHQL_COMPLEXITY_MAX, useValue: MAX_COMPLEXITY },
        { provide: APP_GUARD, useClass: GraphqlThrottlerGuard },
      ],
    };
  }
}
