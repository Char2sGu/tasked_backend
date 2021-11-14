import { Module } from '@nestjs/common';

import { AssignmentsModule } from './assignments/assignments.module';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { CoreModule } from './core/core.module';
import { JoinApplicationsModule } from './join-applications/join-applications.module';
import { MembershipsModule } from './memberships/memberships.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    ClassroomsModule,
    MembershipsModule,
    JoinApplicationsModule,
    TasksModule,
    AssignmentsModule,
  ],
})
export class AppModule {}
