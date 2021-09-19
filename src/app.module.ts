import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, ValidationPipe } from '@nestjs/common';
import {
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  RouterModule,
} from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { AffairsModule } from './affairs/affairs.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { CommonModule } from './common/common.module';
import { FlushDbInterceptor } from './common/flush-db/flush-db.interceptor';
import { ValidationContextInterceptor } from './common/validation/validation-context.interceptor';
import { DB_PATH } from './constants';
import { JoinApplicationsModule } from './join-applications/join-applications.module';
import { MembershipsModule } from './memberships/memberships.module';
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
    RouterModule.register([
      {
        path: '/api',
        children: [
          { path: '/classrooms', module: ClassroomsModule },
          { path: '/memberships', module: MembershipsModule },
          { path: '/join-applications', module: JoinApplicationsModule },
          { path: '/affairs', module: AffairsModule },
          { path: '/tasks', module: TasksModule },
          { path: '/assignments', module: AssignmentsModule },
        ],
      },
    ]),
    CommonModule,
    AuthModule,
    UsersModule,
    ClassroomsModule,
    MembershipsModule,
    JoinApplicationsModule,
    AffairsModule,
    TasksModule,
    AssignmentsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          exposeDefaultValues: true,
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
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
