import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccessPolicyModule } from 'nest-access-policy';

import { User } from './entities/user.entity';
import { UsersAccessPolicy } from './users.access-policy';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AccessPolicyModule],
  providers: [UsersResolver, UsersService, UsersAccessPolicy],
  exports: [UsersService],
})
export class UsersModule {}
