import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DEBUG } from 'src/env.constants';

@Module({})
export class GraphqlModule {
  static forRoot(): DynamicModule {
    return {
      module: GraphqlModule,
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          playground: DEBUG,
        }),
      ],
    };
  }
}
