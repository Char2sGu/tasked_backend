import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipsModule } from 'src/memberships/memberships.module';

import { ClassroomsAccessPolicy } from './classrooms.access-policy';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';
import { Classroom } from './entities/classroom.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Classroom]),
    AccessPolicyModule,
    AuthModule,
    MembershipsModule,
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomsAccessPolicy],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
