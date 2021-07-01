import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';
import { Classroom } from './entities/classroom.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Classroom]),
    AuthModule,
    MembershipsModule,
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
