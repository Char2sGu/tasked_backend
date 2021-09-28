import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { UseAccessPolicies } from 'nest-access-policy';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { QueryClassroomsArgs } from 'src/classrooms/dto/query-classrooms.args';
import { AccessPolicyGuard } from 'src/common/access-policy/access-policy.guard';
import { SkipAuth } from 'src/common/auth/skip-auth.decorator';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { QueryJoinApplicationsArgs } from 'src/join-applications/dto/query-join-applications.args';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args';
import { MembershipsService } from 'src/memberships/memberships.service';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args';
import { TasksService } from 'src/tasks/tasks.service';

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

  @Inject()
  private readonly classroomsService: ClassroomsService;

  @Inject()
  private readonly membershipsService: MembershipsService;

  @Inject()
  private readonly tasksService: TasksService;

  @Inject()
  private readonly assignmentsService: AssignmentsService;

  @Query(() => PaginatedUsers, {
    name: 'users',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryUsersArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: this.filters(user) },
    );
  }

  @Query(() => User, {
    name: 'user',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryUserArgs) {
    return this.service.retrieve(id, { filters: this.filters(user) });
  }

  @Query(() => User, {
    name: 'current',
  })
  async queryCurrent(@ReqUser() user: User) {
    return user;
  }

  @FlushDb()
  @SkipAuth()
  @Mutation(() => User, {
    name: 'createUser',
  })
  async createOne(@Args() { data }: CreateUserArgs) {
    return this.service.create(data);
  }

  @FlushDb()
  @Mutation(() => User, {
    name: 'updateUser',
  })
  async updateOne(@ReqUser() user: User, @Args() { id, data }: UpdateUserArgs) {
    return this.service.update(id, data, { filters: this.filters(user) });
  }

  @ResolveField(() => User, 'classrooms')
  async resolveClassrooms(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryClassroomsArgs,
  ) {
    return this.classroomsService.list(
      { creator: entity },
      { limit, offset, filters: this.filters(user) },
    );
  }

  @ResolveField(() => User, 'joinApplications')
  async resolveJoinApplications(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryJoinApplicationsArgs,
  ) {
    return this.membershipsService.list(
      { owner: entity },
      { limit, offset, filters: this.filters(user) },
    );
  }

  @ResolveField(() => User, 'memberships')
  async resolveMemberships(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryMembershipsArgs,
  ) {
    return this.membershipsService.list(
      { owner: entity },
      { limit, offset, filters: this.filters(user) },
    );
  }

  @ResolveField(() => User, 'tasks')
  async resolveTasks(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryTasksArgs,
  ) {
    return this.tasksService.list(
      { creator: entity },
      { limit, offset, filters: this.filters(user) },
    );
  }

  @ResolveField(() => User, 'assignments')
  async resolveAssignments(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryAssignmentsArgs,
  ) {
    return this.assignmentsService.list(
      { recipient: entity },
      { limit, offset, filters: this.filters(user) },
    );
  }
}
