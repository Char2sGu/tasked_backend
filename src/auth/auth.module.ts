import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/env.constants';
import { SharedModule } from 'src/shared/shared.module';
import { User } from 'src/users/entities/user.entity';

import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forFeature([User]),
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: '1 weeks' },
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
