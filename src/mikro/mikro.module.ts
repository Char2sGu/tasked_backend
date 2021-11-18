import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DynamicModule, Module, NotFoundException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DB_PATH } from 'src/configurations';
import { Repository } from 'src/mikro/repository.class';

import { MikroFlushInterceptor } from './mikro-flush.interceptor';
import { MikroQueryContextInterceptor } from './mikro-query-context.interceptor';

@Module({})
export class MikroModule {
  static forRoot(): DynamicModule {
    return {
      module: MikroModule,
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
          useClass: MikroQueryContextInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: MikroFlushInterceptor,
        },
      ],
    };
  }
}
