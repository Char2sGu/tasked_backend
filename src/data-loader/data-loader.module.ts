import { DynamicModule, Module } from '@nestjs/common';

import { DataLoaderMiddlewareModule } from './data-loader-middleware.module';

@Module({})
export class DataLoaderModule {
  static forRoot(): DynamicModule {
    return {
      module: DataLoaderModule,
      imports: [DataLoaderMiddlewareModule],
    };
  }
}
