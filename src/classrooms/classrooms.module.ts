import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';

import { ClassroomsAccessPolicy } from './classrooms.access-policy';
import { ClassroomsResolver } from './classrooms.resolver';
import { ClassroomsService } from './classrooms.service';
import { Classroom } from './entities/classroom.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Classroom]), AccessPolicyModule],
  providers: [ClassroomsResolver, ClassroomsService, ClassroomsAccessPolicy],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
