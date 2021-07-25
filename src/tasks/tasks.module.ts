import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { Task } from './entities/task.entity';
import { TasksAccessPolicy } from './tasks.access-policy';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Task]),
    AuthModule,
    AccessPolicyModule,
    MembershipsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksAccessPolicy],
  exports: [TasksService],
})
export class TasksModule {}
