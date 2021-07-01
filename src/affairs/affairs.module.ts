import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';
import { AffairsController } from './affairs.controller';
import { AffairsService } from './affairs.service';
import { Affair } from './entities/affair.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Affair]), AuthModule, ClassroomsModule],
  controllers: [AffairsController],
  providers: [AffairsService],
  exports: [AffairsService],
})
export class AffairsModule {}
