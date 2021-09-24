import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';

import { AffairsAccessPolicy } from './affairs.access-policy';
import { AffairsResolver } from './affairs.resolver';
import { AffairsService } from './affairs.service';
import { Affair } from './entities/affair.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Affair]),
    AccessPolicyModule,
    ClassroomsModule,
  ],
  providers: [AffairsResolver, AffairsService, AffairsAccessPolicy],
  exports: [AffairsService],
})
export class AffairsModule {}
