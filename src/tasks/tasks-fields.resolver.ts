import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { MikroRefLoaderService } from 'src/mikro/mikro-ref-loader/mikro-ref-loader.service';

import { Task } from './entities/task.entity';

@Resolver(() => Task)
export class TasksFieldsResolver {
  constructor(
    private loader: MikroRefLoaderService,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async creator(@Parent() entity: Task) {
    return this.loader.load(entity.creator);
  }

  @ResolveField()
  async classroom(@Parent() entity: Task) {
    return this.loader.load(entity.classroom);
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Task,
  ) {
    return this.assignmentsService.queryMany(args, { task: entity });
  }
}
