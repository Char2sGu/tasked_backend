import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { AssignmentsModule } from './assignments/assignments.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { CommonModule } from './common/common.module';
import { ValidationContextInterceptor } from './common/validation/validation-context.interceptor';
import { DB_PATH } from './configurations';
import { CrudModule } from './crud/crud.module';
import { JoinApplicationsModule } from './join-applications/join-applications.module';
import { MembershipsModule } from './memberships/memberships.module';
import { FlushDbInterceptor } from './shared/flush-db.interceptor';
import { SharedModule } from './shared/shared.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

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
    CommonModule,
    SharedModule,
    CrudModule,
    AuthModule,
    UsersModule,
    ClassroomsModule,
    MembershipsModule,
    JoinApplicationsModule,
    TasksModule,
    AssignmentsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          exposeDefaultValues: true, // `@Field(..., { defaultValue: ... })` cannot work in `@ResolveField()` (Bug)
          exposeUnsetFields: false, // if `true`, update actions will unexpectedly assign an `undefined` value to the entity fields and cause error
        },
        whitelist: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FlushDbInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationContextInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
