import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DynamicModule, Module, NotFoundException } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DB_PATH, DEBUG } from 'src/env.constants';
import { Repository } from 'src/mikro/repository.class';

import { MikroRefLoaderService } from './mikro-ref-loader/mikro-ref-loader.service';
import { MikroFlushInterceptor } from './mikro-flush/mikro-flush.interceptor';
import { MikroMiddlewareModule } from './mikro-middleware.module';
import { MikroQueryContextInterceptor } from './mikro-query-context/mikro-query-context.interceptor';
import { MikroQuotaFilter } from './mikro-quota/mikro-quota.filter';
import { MikroQuotaService } from './mikro-quota/mikro-quota.service';

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
          findOneOrFailHandler: () => new NotFoundException(),
          entityRepository: Repository,
          debug: DEBUG,
        }),
        MikroMiddlewareModule,
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
        {
          provide: APP_FILTER,
          useClass: MikroQuotaFilter,
        },
      ],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: MikroModule,
      providers: [MikroQuotaService, MikroRefLoaderService],
      exports: [MikroQuotaService, MikroRefLoaderService],
    };
  }
}
