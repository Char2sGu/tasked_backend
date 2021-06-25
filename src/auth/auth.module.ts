import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/constants';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStragegy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '4h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStragegy],
})
export class AuthModule {}
