import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { PaginatedJoinApplications } from 'src/join-applications/dto/paginated-join-applications.dto';
import { QueryJoinApplicationsArgs } from 'src/join-applications/dto/query-join-applications.args';
import { JoinApplicationsService } from 'src/join-applications/join-applications.service';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args';
import { MembershipsService } from 'src/memberships/memberships.service';
import { ReqUser } from 'src/shared/req-user.decorator';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args';
import { TasksService } from 'src/tasks/tasks.service';
import { User } from 'src/users/entities/user.entity';

import { Classroom } from './entities/classroom.entity';

@Resolver(() => Classroom)
export class ClassroomsFieldsResolver {
  constructor(
    private joinApplicationsService: JoinApplicationsService,
    private membershipsService: MembershipsService,
    private tasksService: TasksService,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async creator(@Parent() entity: Classroom) {
    return entity.creator.init();
  }

  @ResolveField()
  async membership(@ReqUser() user: User, @Parent() entity: Classroom) {
    return entity.memberships
      .matching({ where: { owner: user }, limit: 1 })
      .then(([v]) => v);
  }

  @ResolveField(() => PaginatedJoinApplications)
  async joinApplications(
    @Args() args: QueryJoinApplicationsArgs,
    @Parent() entity: Classroom,
    @ReqUser() user: User,
  ) {
    return this.joinApplicationsService.queryMany(user, args, {
      classroom: entity,
    });
  }

  @ResolveField()
  async memberships(
    @Args() args: QueryMembershipsArgs,
    @Parent() entity: Classroom,
    @ReqUser() user: User,
  ) {
    return this.membershipsService.queryMany(user, args, { classroom: entity });
  }

  @ResolveField()
  async tasks(
    @Args() args: QueryTasksArgs,
    @Parent() entity: Classroom,
    @ReqUser() user: User,
  ) {
    return this.tasksService.queryMany(user, args, { classroom: entity });
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Classroom,
    @ReqUser() user: User,
  ) {
    return this.assignmentsService.queryMany(user, args, {
      task: { classroom: entity },
    });
  }
}
