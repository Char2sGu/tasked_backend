import { forwardRef, Module } from '@nestjs/common';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { CrudModule } from 'src/crud/crud.module';
import { JoinApplicationsModule } from 'src/join-applications/join-applications.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { SharedModule } from 'src/shared/shared.module';
import { TasksModule } from 'src/tasks/tasks.module';

import { ClassroomsResolver } from './classrooms.resolver';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsFieldsResolver } from './classrooms-fields.resolver';
import { Classroom } from './entities/classroom.entity';

@Module({
  imports: [
    SharedModule,
    CrudModule.forFeature(Classroom, { soft: 'deletedAt' }),
    forwardRef(() => JoinApplicationsModule),
    forwardRef(() => MembershipsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => AssignmentsModule),
  ],
  providers: [ClassroomsResolver, ClassroomsFieldsResolver, ClassroomsService],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
