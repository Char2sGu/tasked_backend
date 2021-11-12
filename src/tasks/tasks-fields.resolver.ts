import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { ReqUser } from 'src/shared/req-user.decorator';
import { User } from 'src/users/entities/user.entity';

import { Task } from './entities/task.entity';

@Resolver(() => Task)
export class TasksFieldsResolver {
  constructor(private assignmentsService: AssignmentsService) {}

  @ResolveField()
  async creator(@Parent() entity: Task) {
    return entity.creator.init();
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Task,
    @ReqUser() user: User,
  ) {
    return this.assignmentsService.queryMany(user, args, { classroom: entity });
  }
}
