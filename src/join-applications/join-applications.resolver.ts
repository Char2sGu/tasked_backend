import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseAccessPolicies } from 'nest-access-policy';
import { AccessPolicyGuard } from 'src/common/access-policy/access-policy.guard';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';

import { CreateJoinApplicationArgs } from './dto/create-join-application.args';
import { PaginatedJoinApplications } from './dto/paginated-join-applications.dto';
import { QueryJoinApplicationArgs } from './dto/query-join-application.args';
import { QueryJoinApplicationsArgs } from './dto/query-join-applications.args';
import { UpdateJoinApplicationArgs } from './dto/update-join-application.args';
import { ApplicationStatus } from './entities/application-status.enum';
import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsAccessPolicy } from './join-applications.access-policy';
import { JoinApplicationsService } from './join-applications.service';

@UseAccessPolicies(JoinApplicationsAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Resolver(() => JoinApplication)
export class JoinApplicationsResolver {
  @Inject()
  private readonly service: JoinApplicationsService;

  @Inject()
  private readonly membershipsService: MembershipsService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  @Query(() => PaginatedJoinApplications, { name: 'joinApplications' })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryJoinApplicationsArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: this.filters(user) },
    );
  }

  @Query(() => JoinApplication, { name: 'joinApplication' })
  async queryOne(
    @ReqUser() user: User,
    @Args() { id }: QueryJoinApplicationArgs,
  ) {
    return this.service.retrieve(id, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => JoinApplication, { name: 'createJoinApplication' })
  async createOne(
    @ReqUser() user: User,
    @Args() { data }: CreateJoinApplicationArgs,
  ) {
    return this.service.create({ ...data, owner: user });
  }

  @FlushDb()
  @Mutation(() => JoinApplication, { name: 'updateJoinApplication' })
  async updateOne(
    @ReqUser() user: User,
    @Args() { id, data }: UpdateJoinApplicationArgs,
  ) {
    const entity = await this.service.update(id, data, {
      filters: this.filters(user),
    });
    if (data.status == ApplicationStatus.Accepted)
      await this.membershipsService.create({
        owner: user,
        classroom: entity.classroom,
        role: entity.role,
      });
    return entity;
  }
}
