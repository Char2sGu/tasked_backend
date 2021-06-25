import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';
import { AffairsController } from './affairs.controller';
import { AffairsService } from './affairs.service';
import { Affair } from './entities/affair.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Affair]), ClassroomsModule],
  controllers: [AffairsController],
  providers: [AffairsService],
  exports: [AffairsService],
})
export class AffairsModule {}
