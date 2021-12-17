import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DataLoaderContextMiddleware } from './data-loader-context.middleware';

@Module({})
export class DataLoaderMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DataLoaderContextMiddleware).forRoutes('*');
  }
}
