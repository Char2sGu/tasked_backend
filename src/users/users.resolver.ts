import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  ArgsType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseAccessPolicies } from 'nest-access-policy';
import { AccessPolicyGuard } from 'src/common/access-policy.guard';
import { SkipAuth } from 'src/common/auth/skip-auth.decorator';
import { CRUD_FILTERS } from 'src/common/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters.type';
import { CreateOneArgs } from 'src/common/dto/create-one.args';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { QueryManyArgs } from 'src/common/dto/query-many.args';
import { QueryOneArgs } from 'src/common/dto/query-one.args';
import { UpdateOneArgs } from 'src/common/dto/update-one.args';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';

import { UserCreateInput } from './dto/user-create.input';
import { UserUpdateInput } from './dto/user-update.input';
import { User } from './entities/user.entity';
import { UsersAccessPolicy } from './users.access-policy';

@ObjectType()
class PaginatedUsers extends PaginatedDto.of(User) {}
@ArgsType()
class QueryUsersArgs extends QueryManyArgs {}
@ArgsType()
class QueryUserArgs extends QueryOneArgs {}
@ArgsType()
class CreateUserArgs extends CreateOneArgs.of(UserCreateInput) {}
@ArgsType()
class UpdateUserArgs extends UpdateOneArgs.of(UserUpdateInput) {}

@UseAccessPolicies(UsersAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Resolver(() => User)
export class UsersResolver {
  @InjectRepository(User)
  private readonly repo: EntityRepository<User>;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  @Query(() => PaginatedUsers, { name: 'users' })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryUsersArgs,
  ) {
    const [results, total] = await this.repo.findAndCount(
      {},
      { limit, offset, filters: this.filters(user) },
    );
    return { total, results };
  }

  @Query(() => User, { name: 'user' })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryUserArgs) {
    return this.repo.findOneOrFail(id, { filters: this.filters(user) });
  }

  @Query(() => User, { name: 'current' })
  async queryCurrent(@ReqUser() user: User) {
    return user;
  }

  @FlushDb()
  @SkipAuth()
  @Mutation(() => User, { name: 'createUser' })
  async createOne(@ReqUser() user: User, @Args() { data }: CreateUserArgs) {
    const entity = this.repo.create(data);
    this.repo.persist(entity);
    return entity;
  }

  @FlushDb()
  @Mutation(() => User, { name: 'updateUser' })
  async updateOne(@ReqUser() user: User, @Args() { id, data }: UpdateUserArgs) {
    const entity = await this.repo.findOneOrFail(id, {
      filters: this.filters(user),
    });
    return entity.assign(data);
  }
}
