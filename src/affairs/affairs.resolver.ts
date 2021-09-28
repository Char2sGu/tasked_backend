import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { UseAccessPolicies } from 'nest-access-policy';
import { AccessPolicyGuard } from 'src/common/access-policy/access-policy.guard';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { User } from 'src/users/entities/user.entity';

import { AffairsAccessPolicy } from './affairs.access-policy';
import { AffairsService } from './affairs.service';
import { CreateAffairArgs } from './dto/create-affair.args';
import { DeleteAffairArgs } from './dto/delete-affair.args';
import { PaginatedAffairs } from './dto/paginated-affairs.dto';
import { QueryAffairArgs } from './dto/query-affair.args';
import { QueryAffairsArgs } from './dto/query-affairs.args';
import { UpdateAffairArgs } from './dto/update-affair.args';
import { Affair } from './entities/affair.entity';

@UseAccessPolicies(AffairsAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Resolver(() => Affair)
export class AffairsResolver {
  @Inject()
  service: AffairsService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  @Query(() => PaginatedAffairs, {
    name: 'affairs',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryAffairsArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: this.filters(user) },
    );
  }

  @Query(() => Affair, {
    name: 'affair',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryAffairArgs) {
    return this.service.retrieve(id, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'createAffair',
  })
  async createOne(@ReqUser() user: User, @Args() { data }: CreateAffairArgs) {
    return this.service.create({ ...data, creator: user });
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'updateAffair',
  })
  async updateOne(
    @ReqUser() user: User,
    @Args() { id, data }: UpdateAffairArgs,
  ) {
    return this.service.update(id, data, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'deleteAffair',
  })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteAffairArgs) {
    return this.service.destroy(id, { filters: this.filters(user) });
  }

  @ResolveField(() => Affair, 'classroom')
  async resolveClassroom(@Parent() entity: Affair) {
    return entity.classroom.init();
  }
}
