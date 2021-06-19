import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SheduleItem } from './entities/shedule-item.entity';
import { SheduleItemsController } from './shedule-items.controller';
import { SheduleItemsService } from './shedule-items.service';

@Module({
  imports: [MikroOrmModule.forFeature([SheduleItem])],
  controllers: [SheduleItemsController],
  providers: [SheduleItemsService],
  exports: [SheduleItemsService],
})
export class SheduleItemsModule {}
