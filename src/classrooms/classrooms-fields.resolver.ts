import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.dto';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { Context } from 'src/context/context.class';
import { PaginatedJoinApplications } from 'src/join-applications/dto/paginated-join-applications.dto';
import { QueryJoinApplicationsArgs } from 'src/join-applications/dto/query-join-applications.args';
import { JoinApplicationsService } from 'src/join-applications/join-applications.service';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { MikroRefLoaderService } from 'src/mikro/mikro-ref-loader/mikro-ref-loader.service';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args';
import { TasksService } from 'src/tasks/tasks.service';

import { Classroom } from './entities/classroom.entity';

@Resolver(() => Classroom)
export class ClassroomsFieldsResolver {
  constructor(
    private batch: MikroRefLoaderService,
    private joinApplicationsService: JoinApplicationsService,
    private membershipsService: MembershipsService,
    private tasksService: TasksService,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async creator(@Parent() entity: Classroom) {
    return this.batch.load(entity.creator);
  }

  @ResolveField(() => PaginatedJoinApplications)
  async joinApplications(
    @Args() args: QueryJoinApplicationsArgs,
    @Parent() entity: Classroom,
  ) {
    return this.joinApplicationsService.queryMany(args, {
      classroom: entity,
    });
  }

  @ResolveField()
  async memberships(
    @Args() args: QueryMembershipsArgs,
    @Parent() entity: Classroom,
  ) {
    return this.membershipsService.queryMany(args, { classroom: entity });
  }

  @ResolveField()
  async tasks(@Args() args: QueryTasksArgs, @Parent() entity: Classroom) {
    return this.tasksService.queryMany(args, { classroom: entity });
  }

  @ResolveField(() => Membership, { nullable: true })
  async membership(@Parent() entity: Classroom) {
    return entity.memberships
      .matching({ where: { owner: Context.current.user }, limit: 1 })
      .then(([v]) => v);
  }

  @ResolveField(() => PaginatedAssignments)
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Classroom,
  ) {
    return this.assignmentsService.queryMany(args, {
      task: { classroom: entity },
    });
  }
}
