import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_VALIDITY_PERIOD } from 'src/constants';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStragegy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: `${TOKEN_VALIDITY_PERIOD}` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStragegy],
})
export class AuthModule {}
