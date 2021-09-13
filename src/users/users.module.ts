import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';
import { AuthModule } from 'src/auth/auth.module';

import { User } from './entities/user.entity';
import { UsersAccessPolicy } from './users.access-policy';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    AccessPolicyModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UsersResolver, UsersService, UsersAccessPolicy],
  exports: [UsersService],
})
export class UsersModule {}
