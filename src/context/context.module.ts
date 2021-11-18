import { DynamicModule, Module } from '@nestjs/common';

import { ContextCoreModule } from './context-core.module';

@Module({})
export class ContextModule {
  static forRoot(): DynamicModule {
    return {
      module: ContextModule,
      imports: [ContextCoreModule],
    };
  }
}
