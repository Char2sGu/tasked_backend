import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { QueryClassroomsArgs } from 'src/classrooms/dto/query-classrooms.args';
import { QueryJoinApplicationsArgs } from 'src/join-applications/dto/query-join-applications.args';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args';
import { MembershipsService } from 'src/memberships/memberships.service';
import { ReqUser } from 'src/shared/req-user.decorator';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args';
import { TasksService } from 'src/tasks/tasks.service';

import { User } from './entities/user.entity';

@Resolver(() => User)
export class UsersFieldsResolver {
  constructor(
    private classroomsService: ClassroomsService,
    private membershipsService: MembershipsService,
    private tasksService: TasksService,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async classrooms(
    @Args() args: QueryClassroomsArgs,
    @Parent() entity: User,
    @ReqUser() user: User,
  ) {
    return this.classroomsService.queryMany(user, args, { creator: entity });
  }

  @ResolveField()
  async joinApplications(
    @Args() args: QueryJoinApplicationsArgs,
    @Parent() entity: User,
    @ReqUser() user: User,
  ) {
    return this.membershipsService.queryMany(user, args, { owner: entity });
  }

  @ResolveField()
  async memberships(
    @Args() args: QueryMembershipsArgs,
    @Parent() entity: User,
    @ReqUser() user: User,
  ) {
    return this.membershipsService.queryMany(user, args, { owner: entity });
  }

  @ResolveField()
  async tasks(
    @Args() args: QueryTasksArgs,
    @Parent() entity: User,
    @ReqUser() user: User,
  ) {
    return this.tasksService.queryMany(user, args, { creator: entity });
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: User,
    @ReqUser() user: User,
  ) {
    return this.assignmentsService.queryMany(user, args, { recipient: entity });
  }
}
