import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, NotFoundException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DB_PATH } from 'src/configurations';
import { Repository } from 'src/mikro/repository.class';

import { MikroFiltersInterceptor } from './mikro-filters.interceptor';
import { MikroRequestContextInterceptor } from './mikro-request-context.interceptor';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      type: 'sqlite',
      dbName: DB_PATH,
      autoLoadEntities: true,
      forceUndefined: true,
      context: () => MikroRequestContextInterceptor.storage.getStore(),
      findOneOrFailHandler: () => new NotFoundException(),
      entityRepository: Repository,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroRequestContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroFiltersInterceptor,
    },
  ],
})
export class MikroModule {}
