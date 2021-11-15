import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, NotFoundException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DB_PATH } from 'src/configurations';
import { Repository } from 'src/mikro/repository.class';

import { MikroFiltersInterceptor } from './mikro-filters.interceptor';
import { MikroFlushInterceptor } from './mikro-flush.interceptor';
import { MikroQueryContextInterceptor } from './mikro-query-context.interceptor';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      type: 'sqlite',
      dbName: DB_PATH,
      autoLoadEntities: true,
      forceUndefined: true,
      context: () => MikroQueryContextInterceptor.storage.getStore(),
      findOneOrFailHandler: () => new NotFoundException(),
      entityRepository: Repository,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroFiltersInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroQueryContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroFlushInterceptor,
    },
  ],
})
export class MikroModule {}
