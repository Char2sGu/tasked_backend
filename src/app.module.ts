import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AffairsModule } from './affairs/affairs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { DB_PATH } from './constants';
import { JoinApplicationsModule } from './join-applications/join-applications.module';
import { MembershipsModule } from './memberships/memberships.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      type: 'sqlite',
      dbName: DB_PATH,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    ClassroomsModule,
    MembershipsModule,
    JoinApplicationsModule,
    AffairsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
