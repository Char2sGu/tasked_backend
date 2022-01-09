import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
import { DEBUG, MAX_COMPLEXITY, MAX_DEPTH } from 'src/env.constants';

import { GraphqlComplexityPlugin } from './graphql-complexity.plugin';
import { GRAPHQL_COMPLEXITY_MAX } from './graphql-complexity-max.token';

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
      ],
      providers: [
        GraphqlComplexityPlugin,
        { provide: GRAPHQL_COMPLEXITY_MAX, useValue: MAX_COMPLEXITY },
      ],
    };
  }
}
