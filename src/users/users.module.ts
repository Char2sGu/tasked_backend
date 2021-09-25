import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';
import { JoinApplicationsModule } from 'src/join-applications/join-applications.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { TasksModule } from 'src/tasks/tasks.module';

import { User } from './entities/user.entity';
import { UsersAccessPolicy } from './users.access-policy';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    AccessPolicyModule,
    forwardRef(() => ClassroomsModule),
    forwardRef(() => JoinApplicationsModule),
    forwardRef(() => MembershipsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => AssignmentsModule),
  ],
  providers: [UsersResolver, UsersService, UsersAccessPolicy],
  exports: [UsersService],
})
export class UsersModule {}
