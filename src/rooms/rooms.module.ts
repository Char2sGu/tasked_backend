import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { ApplicationsModule } from 'src/applications/applications.module';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { SharedModule } from 'src/shared/shared.module';
import { TasksModule } from 'src/tasks/tasks.module';

import { Room } from './entities/room.entity';
import { RoomRefLoader } from './room-ref.loader';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';
import { RoomsFieldsResolver } from './rooms-fields.resolver';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([Room]),
    forwardRef(() => ApplicationsModule),
    forwardRef(() => MembershipsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => AssignmentsModule),
  ],
  providers: [RoomsResolver, RoomsFieldsResolver, RoomsService, RoomRefLoader],
  exports: [RoomsService, RoomRefLoader],
})
export class RoomsModule {}
