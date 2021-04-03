import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStragegy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: `${process.env.TOKEN_EXPIRY}` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStragegy],
})
export class AuthModule {}
