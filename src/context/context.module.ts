import { DynamicModule, Module } from '@nestjs/common';

import { ContextMiddlewareModule } from './context-middleware.module';

@Module({})
export class ContextModule {
  static forRoot(): DynamicModule {
    return {
      module: ContextModule,
      imports: [ContextMiddlewareModule],
    };
  }
}
