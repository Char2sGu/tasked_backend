import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { AffairsModule } from './affairs/affairs.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
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
    }),
    RouterModule.register([
      {
        path: '/api',
        children: [
          { path: '/auth', module: AuthModule },
          { path: '/users', module: UsersModule },
          { path: '/classrooms', module: ClassroomsModule },
          { path: '/memberships', module: MembershipsModule },
          { path: '/join-applications', module: JoinApplicationsModule },
          { path: '/affairs', module: AffairsModule },
          { path: '/tasks', module: TasksModule },
          { path: '/assignments', module: AssignmentsModule },
        ],
      },
    ]),
    AuthModule,
    UsersModule,
    ClassroomsModule,
    MembershipsModule,
    JoinApplicationsModule,
    AffairsModule,
    TasksModule,
    AssignmentsModule,
  ],
})
export class AppModule {}
