import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MikroBatchContextMiddleware } from './mikro-batch/mikro-batch-context.middleware';

@Module({})
export class MikroMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroBatchContextMiddleware).forRoutes('*');
  }
}
