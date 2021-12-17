import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ApplicationsService } from 'src/applications/applications.service';
import { PaginatedApplications } from 'src/applications/dto/paginated-applications.obj.dto';
import { QueryApplicationsArgs } from 'src/applications/dto/query-applications.args.dto';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.obj.dto';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args.dto';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.obj.dto';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { UserRefLoader } from 'src/users/user-ref.loader';

import { Room } from './entities/room.entity';
import { RoomMembershipLoader } from './room-membership.loader';

@Resolver(() => Room)
export class RoomsFieldsResolver {
  constructor(
    private userRefLoader: UserRefLoader,
    private roomMembershipLoader: RoomMembershipLoader,
    private applicationsService: ApplicationsService,
    private membershipsService: MembershipsService,
    private tasksService: TasksService,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async creator(@Parent() entity: Room) {
    return this.userRefLoader.load(entity.creator);
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

  @ResolveField(() => Membership, { nullable: true })
  async membership(@Parent() entity: Room) {
    return this.roomMembershipLoader.load(entity);
  }

  @ResolveField(() => PaginatedTasks)
  async tasks(@Args() args: QueryTasksArgs, @Parent() entity: Room) {
    return this.tasksService.queryMany(args, { creator: { room: entity } });
  }

  @ResolveField(() => PaginatedAssignments)
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Room,
  ) {
    return this.assignmentsService.queryMany(args, {
      task: { creator: { room: entity } },
    });
  }
}
