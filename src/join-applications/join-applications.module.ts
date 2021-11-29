import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { SharedModule } from 'src/shared/shared.module';

import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsResolver } from './join-applications.resolver';
import { JoinApplicationsService } from './join-applications.service';
import { JoinApplicationsFieldsResolver } from './join-applications-fields.resolver';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([JoinApplication, Membership, Room]),
  ],
  providers: [
    JoinApplicationsResolver,
    JoinApplicationsFieldsResolver,
    JoinApplicationsService,
  ],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
