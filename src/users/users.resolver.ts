import { ForbiddenException, Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { QueryClassroomsArgs } from 'src/classrooms/dto/query-classrooms.args';
import { SkipAuth } from 'src/common/auth/skip-auth.decorator';
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
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  @Inject()
  private readonly service: UsersService;

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
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @Query(() => User, {
    name: 'user',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryUserArgs) {
    return this.service.retrieve(id, { filters: { visible: { user } } });
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
  async createOne(@Args() { data }: CreateUserArgs) {
    return this.service.create(data);
  }

  @FlushDb()
  @Mutation(() => User, {
    name: 'updateUser',
  })
  async updateOne(@ReqUser() user: User, @Args() { id, data }: UpdateUserArgs) {
    const entity = await this.service.retrieve(id, {
      filters: { visible: { user } },
    });

    if (entity != user)
      throw new ForbiddenException('Cannot update other users');
    if (entity.isUpdatedRecently)
      throw new ForbiddenException('Cannot update again within 3 days');

    return this.service.update(id, data);
  }

  @ResolveField(() => User, 'classrooms')
  async resolveClassrooms(
    @ReqUser() user: User,
    @Parent() entity: User,
    @Args() { limit, offset }: QueryClassroomsArgs,
  ) {
    return this.classroomsService.list(
      { creator: entity },
      { limit, offset, filters: { visible: { user } } },
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
      { limit, offset, filters: { visible: { user } } },
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
      { limit, offset, filters: { visible: { user } } },
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
      { limit, offset, filters: { visible: { user } } },
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
      { limit, offset, filters: { visible: { user } } },
    );
  }
}
