import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AffairsModule } from 'src/affairs/affairs.module';
import { JoinApplicationsModule } from 'src/join-applications/join-applications.module';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { ClassroomsAccessPolicy } from './classrooms.access-policy';
import { ClassroomsResolver } from './classrooms.resolver';
import { ClassroomsService } from './classrooms.service';
import { Classroom } from './entities/classroom.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Classroom]),
    AccessPolicyModule,
    forwardRef(() => JoinApplicationsModule),
    forwardRef(() => MembershipsModule),
    forwardRef(() => AffairsModule),
  ],
  providers: [ClassroomsResolver, ClassroomsService, ClassroomsAccessPolicy],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
