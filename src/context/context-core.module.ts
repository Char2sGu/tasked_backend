import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ContextMiddleware } from './context.middleware';

@Module({})
export class ContextCoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
