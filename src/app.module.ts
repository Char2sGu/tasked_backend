import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { AssignmentsModule } from './assignments/assignments.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { DB_PATH } from './configurations';
import { CoreModule } from './core/core.module';
import { CrudModule } from './crud/crud.module';
import { JoinApplicationsModule } from './join-applications/join-applications.module';
import { MembershipsModule } from './memberships/memberships.module';
import { FlushDbInterceptor } from './shared/flush-db.interceptor';
import { SharedModule } from './shared/shared.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ValidationModule } from './validation/validation.module';

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
    CoreModule,
    SharedModule,
    CrudModule,
    ValidationModule,
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
      provide: APP_INTERCEPTOR,
      useClass: FlushDbInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
