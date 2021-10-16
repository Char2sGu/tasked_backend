import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.dto';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { PaginatedClassrooms } from 'src/classrooms/dto/paginated-classrooms.dto';
import { QueryClassroomsArgs } from 'src/classrooms/dto/query-classrooms.args';
import { SkipAuth } from 'src/common/auth/skip-auth.decorator';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { PaginatedJoinApplications } from 'src/join-applications/dto/paginated-join-applications.dto';
import { QueryJoinApplicationsArgs } from 'src/join-applications/dto/query-join-applications.args';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args';
import { MembershipsService } from 'src/memberships/memberships.service';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.dto';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args';
import { TasksService } from 'src/tasks/tasks.service';

import { CreateUserArgs } from './dto/create-user.args';
import { PaginatedUsers } from './dto/paginated-users.dto';
import { QueryUserArgs } from './dto/query-user.args';
import { QueryUsersArgs } from './dto/query-users.args';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  @Inject()
  private service: UsersService;

  @Inject()
  private classrooms: ClassroomsService;

  @Inject()
  private memberships: MembershipsService;

  @Inject()
  private tasks: TasksService;

  @Inject()
  private assignments: AssignmentsService;

  @Query(() => PaginatedUsers, {
    name: 'users',
  })
  async queryMany(@ReqUser() user: User, @Args() args: QueryUsersArgs) {
    return this.service.queryMany(user, args);
  }

  @Query(() => User, {
    name: 'user',
  })
  async queryOne(@ReqUser() user: User, @Args() args: QueryUserArgs) {
    return this.service.queryOne(user, args);
  }

  @Query(() => User, {
    name: 'me',
  })
  async queryMe(@ReqUser() user: User) {
    return user;
  }

  @FlushDb()
  @SkipAuth()
  @Mutation(() => User, {
    name: 'createUser',
  })
  async createOne(@Args() args: CreateUserArgs) {
    return this.service.createOne(args);
  }

  @FlushDb()
  @Mutation(() => User, {
    name: 'updateUser',
  })
  async updateOne(@ReqUser() user: User, @Args() args: UpdateUserArgs) {
    return this.service.updateOne(user, args);
  }

  @ResolveField(() => User, 'classrooms', () => PaginatedClassrooms)
  async resolveClassrooms(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryClassroomsArgs,
  ) {
    return this.classrooms.list(
      { creator: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => User, 'joinApplications', () => PaginatedJoinApplications)
  async resolveJoinApplications(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryJoinApplicationsArgs,
  ) {
    return this.memberships.list(
      { owner: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => User, 'memberships', () => PaginatedMemberships)
  async resolveMemberships(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryMembershipsArgs,
  ) {
    return this.memberships.list(
      { owner: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => User, 'tasks', () => PaginatedTasks)
  async resolveTasks(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryTasksArgs,
  ) {
    return this.tasks.list(
      { creator: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => User, 'assignments', () => PaginatedAssignments)
  async resolveAssignments(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryAssignmentsArgs,
  ) {
    return this.assignments.list(
      { recipient: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }
}
