import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/constants';
import { UsersModule } from 'src/users/users.module';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '4h' },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
