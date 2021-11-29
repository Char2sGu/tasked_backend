import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { SharedModule } from 'src/shared/shared.module';

import { ApplicationsResolver } from './applications.resolver';
import { ApplicationsService } from './applications.service';
import { ApplicationsFieldsResolver } from './applications-fields.resolver';
import { Application } from './entities/application.entity';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([Application, Membership, Room]),
  ],
  providers: [
    ApplicationsResolver,
    ApplicationsFieldsResolver,
    ApplicationsService,
  ],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
