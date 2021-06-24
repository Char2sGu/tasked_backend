import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';
import { ScheduleItem } from './entities/schedule-item.entity';
import { ScheduleItemsController } from './schedule-items.controller';
import { ScheduleItemsService } from './schedule-items.service';

@Module({
  imports: [MikroOrmModule.forFeature([ScheduleItem]), ClassroomsModule],
  controllers: [ScheduleItemsController],
  providers: [ScheduleItemsService],
  exports: [ScheduleItemsService],
})
export class ScheduleItemsModule {}
