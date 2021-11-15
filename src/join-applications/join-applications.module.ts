import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { SharedModule } from 'src/shared/shared.module';

import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsResolver } from './join-applications.resolver';
import { JoinApplicationsService } from './join-applications.service';
import { JoinApplicationsFieldsResolver } from './join-applications-fields.resolver';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([JoinApplication, Membership, Classroom]),
  ],
  providers: [
    JoinApplicationsResolver,
    JoinApplicationsFieldsResolver,
    JoinApplicationsService,
  ],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
