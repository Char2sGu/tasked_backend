import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import './config';

export function getTypeOrmRootModule(debug = false) {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: process.env.DB_PATH,
    autoLoadEntities: true,
    synchronize: debug,
    keepConnectionAlive: debug,
  });
}

@Module({
  imports: [getTypeOrmRootModule(), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
