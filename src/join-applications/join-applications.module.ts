import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsController } from './join-applications.controller';
import { JoinApplicationsService } from './join-applications.service';

@Module({
  imports: [MikroOrmModule.forFeature([JoinApplication]), MembershipsModule],
  controllers: [JoinApplicationsController],
  providers: [JoinApplicationsService],
  exports: [JoinApplicationsService],
})
export class JoinApplicationsModule {}
