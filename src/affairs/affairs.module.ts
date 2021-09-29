import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';

import { AffairsResolver } from './affairs.resolver';
import { AffairsService } from './affairs.service';
import { Affair } from './entities/affair.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Affair]), ClassroomsModule],
  providers: [AffairsResolver, AffairsService],
  exports: [AffairsService],
})
export class AffairsModule {}
