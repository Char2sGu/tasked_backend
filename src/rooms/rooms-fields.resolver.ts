import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ApplicationsService } from 'src/applications/applications.service';
import { PaginatedApplications } from 'src/applications/dto/paginated-applications.obj.dto';
import { QueryApplicationsArgs } from 'src/applications/dto/query-applications.args.dto';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.obj.dto';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args.dto';
import { Context } from 'src/context/context.class';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { MikroRefLoaderService } from 'src/mikro/mikro-ref-loader/mikro-ref-loader.service';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args.dto';
import { TasksService } from 'src/tasks/tasks.service';

import { Room } from './entities/room.entity';

@Resolver(() => Room)
export class RoomsFieldsResolver {
  constructor(
    private loader: MikroRefLoaderService,
    private applicationsService: ApplicationsService,
    private membershipsService: MembershipsService,
    private tasksService: TasksService,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async creator(@Parent() entity: Room) {
    return this.loader.load(entity.creator);
  }

  @ResolveField(() => PaginatedApplications)
  async applications(
    @Args() args: QueryApplicationsArgs,
    @Parent() entity: Room,
  ) {
    return this.applicationsService.queryMany(args, {
      room: entity,
    });
  }

  @ResolveField()
  async memberships(
    @Args() args: QueryMembershipsArgs,
    @Parent() entity: Room,
  ) {
    return this.membershipsService.queryMany(args, { room: entity });
  }

  @ResolveField()
  async tasks(@Args() args: QueryTasksArgs, @Parent() entity: Room) {
    return this.tasksService.queryMany(args, { room: entity });
  }

  @ResolveField(() => Membership, { nullable: true })
  async membership(@Parent() entity: Room) {
    return entity.memberships
      .matching({ where: { owner: Context.current.user }, limit: 1 })
      .then(([v]) => v);
  }

  @ResolveField(() => PaginatedAssignments)
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Room,
  ) {
    return this.assignmentsService.queryMany(args, {
      task: { room: entity },
    });
  }
}
