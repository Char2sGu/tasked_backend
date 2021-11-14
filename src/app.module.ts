import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AssignmentsModule } from './assignments/assignments.module';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { DB_PATH } from './configurations';
import { CoreModule } from './core/core.module';
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
    CoreModule,
    AuthModule,
    UsersModule,
    ClassroomsModule,
    MembershipsModule,
    JoinApplicationsModule,
    TasksModule,
    AssignmentsModule,
  ],
  providers: [],
})
export class AppModule {}
