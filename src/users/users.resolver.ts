import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseAccessPolicies } from 'nest-access-policy';
import { AccessPolicyGuard } from 'src/common/access-policy/access-policy.guard';
import { SkipAuth } from 'src/common/auth/skip-auth.decorator';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';

import { CreateUserArgs } from './dto/create-user.args';
import { PaginatedUsers } from './dto/paginated-users.dto';
import { QueryUserArgs } from './dto/query-user.args';
import { QueryUsersArgs } from './dto/query-users.args';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';
import { UsersAccessPolicy } from './users.access-policy';
import { UsersService } from './users.service';

@UseAccessPolicies(UsersAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Resolver(() => User)
export class UsersResolver {
  @Inject()
  private readonly service: UsersService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  @Query(() => PaginatedUsers, { name: 'users' })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryUsersArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: this.filters(user) },
    );
  }

  @Query(() => User, { name: 'user' })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryUserArgs) {
    return this.service.retrieve(id, { filters: this.filters(user) });
  }

  @Query(() => User, { name: 'current' })
  async queryCurrent(@ReqUser() user: User) {
    return user;
  }

  @FlushDb()
  @SkipAuth()
  @Mutation(() => User, { name: 'createUser' })
  async createOne(@Args() { data }: CreateUserArgs) {
    return this.service.create(data);
  }

  @FlushDb()
  @Mutation(() => User, { name: 'updateUser' })
  async updateOne(@ReqUser() user: User, @Args() { id, data }: UpdateUserArgs) {
    return this.service.update(id, data, { filters: this.filters(user) });
  }
}
