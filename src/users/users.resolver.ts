import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuardSkip } from 'src/auth/auth-guard-skip.decorator';
import { FlushDbRequired } from 'src/shared/flush-db-required.decorator';
import { ReqUser } from 'src/shared/req-user.decorator';

import { CreateUserArgs } from './dto/create-user.args';
import { PaginatedUsers } from './dto/paginated-users.dto';
import { QueryUserArgs } from './dto/query-user.args';
import { QueryUsersArgs } from './dto/query-users.args';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private service: UsersService) {}

  @Query(() => PaginatedUsers)
  async users(@Args() args: QueryUsersArgs, @ReqUser() user: User) {
    return this.service.queryMany(user, args);
  }

  @Query(() => User)
  async user(@Args() args: QueryUserArgs, @ReqUser() user: User) {
    return this.service.queryOne(user, args);
  }

  @Query(() => User)
  async me(@ReqUser() user: User) {
    return user;
  }

  @FlushDbRequired()
  @AuthGuardSkip()
  @Mutation(() => User)
  async createUser(@Args() args: CreateUserArgs) {
    return this.service.createOne(args);
  }

  @FlushDbRequired()
  @Mutation(() => User)
  async updateUser(@Args() args: UpdateUserArgs, @ReqUser() user: User) {
    return this.service.updateOne(user, args);
  }
}
