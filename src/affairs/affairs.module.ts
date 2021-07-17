import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AuthModule } from 'src/auth/auth.module';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';
import { AffairsController } from './affairs.controller';
import { AffairsService } from './affairs.service';
import { AffairsAccessPolicy } from './affairs.access-policy';
import { Affair } from './entities/affair.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Affair]),
    AccessPolicyModule,
    AuthModule,
    ClassroomsModule,
  ],
  controllers: [AffairsController],
  providers: [AffairsService, AffairsAccessPolicy],
  exports: [AffairsService],
})
export class AffairsModule {}
