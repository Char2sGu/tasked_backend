import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { ApplicationsModule } from 'src/applications/applications.module';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { SharedModule } from 'src/shared/shared.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';

import { Room } from './entities/room.entity';
import { RoomMembershipLoader } from './room-membership.loader';
import { RoomRefLoader } from './room-ref.loader';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';
import { RoomsFieldsResolver } from './rooms-fields.resolver';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([Room, Membership]),
    forwardRef(() => UsersModule),
    forwardRef(() => ApplicationsModule),
    forwardRef(() => MembershipsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => AssignmentsModule),
  ],
  providers: [
    RoomsResolver,
    RoomsFieldsResolver,
    RoomsService,
    RoomRefLoader,
    RoomMembershipLoader,
  ],
  exports: [RoomsService, RoomRefLoader],
})
export class RoomsModule {}
