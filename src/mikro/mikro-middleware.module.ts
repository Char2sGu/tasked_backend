import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MikroFlushContextMiddleware } from './mikro-flush/mikro-flush-context.middleware';
import { MikroRefLoaderContextMiddleware } from './mikro-ref-loader/mikro-ref-loader-context.middleware';

@Module({})
export class MikroMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MikroRefLoaderContextMiddleware, MikroFlushContextMiddleware)
      .forRoutes('*');
  }
}
