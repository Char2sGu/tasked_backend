import { Module } from '@nestjs/common';

import { AssignmentsModule } from './assignments/assignments.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { JoinApplicationsModule } from './join-applications/join-applications.module';
import { MembershipsModule } from './memberships/memberships.module';
import { RoomsModule } from './rooms/rooms.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    RoomsModule,
    MembershipsModule,
    JoinApplicationsModule,
    TasksModule,
    AssignmentsModule,
  ],
})
export class AppModule {}
