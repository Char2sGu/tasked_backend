import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { ReqUser } from 'src/common/req-user.decorator';

import { UserCreateArgs } from './dto/user-create.args';
import { UserQueryArgs } from './dto/user-query.args';
import { UserUpdateArgs } from './dto/user-update.args';
import { UsersPaginated } from './dto/users-paginated.dto';
import { UsersQueryArgs } from './dto/users-query.args';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly service: UsersService) {}

  @Query(() => UsersPaginated, { name: 'users' })
  async queryUsers(
    @ReqUser() user: User,
    @Args() { limit, offset }: UsersQueryArgs,
  ) {
    return this.service.list({ limit, offset, user });
  }

  @Query(() => User, { name: 'user' })
  async queryUser(@ReqUser() user: User, @Args() { id }: UserQueryArgs) {
    return this.service.retrieve({ conditions: id, user });
  }

  @Query(() => User, { name: 'current' })
  async queryCurrent(@ReqUser() user: User) {
    return user;
  }

  @SkipAuth()
  @Mutation(() => User)
  async createUser(@ReqUser() user: User, @Args() { data }: UserCreateArgs) {
    const entity = await this.service.create({ data, user });
    await this.service.save();
    return entity;
  }

  @Mutation(() => User)
  async updateUser(
    @ReqUser() user: User,
    @Args() { id, data }: UserUpdateArgs,
  ) {
    const entity = await this.service.retrieve({ conditions: id, user });
    await this.service.update({ entity, data });
    await this.service.save();
    return entity;
  }
}
