import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args.dto';
import { RoomRefLoader } from 'src/rooms/room-ref.loader';
import { QueryTasksArgs } from 'src/tasks/dto/query-tasks.args.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { User } from 'src/users/entities/user.entity';
import { UserRefLoader } from 'src/users/user-ref.loader';

import { Membership } from './entities/membership.entity';

@Resolver(() => Membership)
export class MembershipsFieldsResolver {
  constructor(
    private userRefLoader: UserRefLoader,
    private roomRefLoader: RoomRefLoader,
    private assignmentsService: AssignmentsService,
    private tasksService: TasksService,
  ) {}

  @ResolveField()
  async owner(@Parent() entity: Membership) {
    return this.userRefLoader.load(entity.owner);
  }

  @ResolveField()
  async room(@Parent() entity: Membership) {
    return this.roomRefLoader.load(entity.room);
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Membership,
  ) {
    return this.assignmentsService.queryMany(args, { recipient: entity });
  }

  @ResolveField()
  async tasks(@Args() args: QueryTasksArgs, @Parent() entity: User) {
    return this.tasksService.queryMany(args, { creator: { owner: entity } });
  }
}
