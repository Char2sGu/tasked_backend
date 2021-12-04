import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DEBUG } from 'src/env.constants';

import { GraphqlComplexityPlugin } from './graphql-complexity.plugin';
import { GRAPHQL_COMPLEXITY_MAX } from './graphql-complexity-max.token';

@Module({})
export class GraphqlModule {
  static forRoot(complexity: number): DynamicModule {
    return {
      module: GraphqlModule,
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          playground: DEBUG,
        }),
      ],
      providers: [
        GraphqlComplexityPlugin,
        { provide: GRAPHQL_COMPLEXITY_MAX, useValue: complexity },
      ],
    };
  }
}
