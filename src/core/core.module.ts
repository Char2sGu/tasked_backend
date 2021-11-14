import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { DB_PATH } from 'src/configurations';

import { FlushDbInterceptor } from './flush-db.interceptor';

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
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: FlushDbInterceptor,
    },
  ],
})
export class CoreModule {}
