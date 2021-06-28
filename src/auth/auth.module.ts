import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SECRET_KEY } from 'src/constants';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStragegy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({}),
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '4h' },
    }),
  ],
  controllers: [AuthController],
  // The `JwtStrategy` doesn't provide anything, but it needs to be instantiated
  // to register itself so that `AuthGuard('jwt')` can work.
  providers: [AuthService, JwtStragegy],
  exports: [AuthService],
})
export class AuthModule {}
