import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MikroModule } from 'src/mikro/mikro.module';

import { FlushDbInterceptor } from './flush-db.interceptor';
import { PaginationInterceptor } from './pagination.interceptor';

/**
 * Provide core providers and should only be imported in the {@link AppModule}.
 */
@Module({
  imports: [
    MikroModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
  providers: [
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
