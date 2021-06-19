import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { JoinApplicationsModule } from './join-applications/join-applications.module';
import { MembershipsModule } from './memberships/memberships.module';
import { SheduleItemsModule } from './shedule-items/shedule-items.module';
import { UsersModule } from './users/users.module';

config();

@Module({
  imports: [
    MikroOrmModule.forRoot({
      type: 'sqlite',
      dbName: process.env.DB_PATH,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    ClassroomsModule,
    MembershipsModule,
    JoinApplicationsModule,
    SheduleItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
