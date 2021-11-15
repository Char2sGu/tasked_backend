import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, NotFoundException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { DB_PATH } from 'src/configurations';
import { CrudModule } from 'src/crud/crud.module';

import { FlushDbInterceptor } from './flush-db.interceptor';
import { MikroRequestContextInterceptor } from './mikro-request-context.interceptor';
import { PaginationInterceptor } from './pagination.interceptor';
import { Repository } from './repository.class';

/**
 * Provide core providers and should only be imported in the {@link AppModule}.
 */
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
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    CrudModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MikroRequestContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FlushDbInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PaginationInterceptor,
    },
  ],
})
export class CoreModule {}
