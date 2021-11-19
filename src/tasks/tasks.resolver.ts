import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateTaskArgs } from './dto/create-task.args';
import { DeleteTaskArgs } from './dto/delete-task.args';
import { PaginatedTasks } from './dto/paginated-tasks.dto';
import { QueryTaskArgs } from './dto/query-task.args';
import { QueryTasksArgs } from './dto/query-tasks.args';
import { UpdateTaskArgs } from './dto/update-task.args';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private service: TasksService) {}

  @Query(() => PaginatedTasks)
  async tasks(@Args() args: QueryTasksArgs) {
    return this.service.queryMany(args);
  }

  @Query(() => Task)
  async task(@Args() args: QueryTaskArgs) {
    return this.service.queryOne(args);
  }

  @Mutation(() => Task)
  async createTask(@Args() args: CreateTaskArgs) {
    return this.service.createOne(args);
  }

  @Mutation(() => Task)
  async updateTask(@Args() args: UpdateTaskArgs) {
    return this.service.updateOne(args);
  }

  @Mutation(() => Task)
  async deleteTask(@Args() args: DeleteTaskArgs) {
    return this.service.deleteOne(args);
  }
}
