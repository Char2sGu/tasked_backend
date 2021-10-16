import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AffairsModule } from 'src/affairs/affairs.module';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { JoinApplicationsModule } from 'src/join-applications/join-applications.module';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { ClassroomsResolver } from './classrooms.resolver';
import { ClassroomsService } from './classrooms.service';
import { Classroom } from './entities/classroom.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Classroom]),
    forwardRef(() => JoinApplicationsModule),
    forwardRef(() => MembershipsModule),
    forwardRef(() => AffairsModule),
    forwardRef(() => AssignmentsModule),
  ],
  providers: [ClassroomsResolver, ClassroomsService],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
