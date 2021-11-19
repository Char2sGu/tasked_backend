import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';

import { Task } from './entities/task.entity';

@Resolver(() => Task)
export class TasksFieldsResolver {
  constructor(private assignmentsService: AssignmentsService) {}

  @ResolveField()
  async creator(@Parent() entity: Task) {
    return entity.creator.init();
  }

  @ResolveField()
  async classroom(@Parent() entity: Task) {
    return entity.classroom.init();
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Task,
  ) {
    return this.assignmentsService.queryMany(args, { task: entity });
  }
}
