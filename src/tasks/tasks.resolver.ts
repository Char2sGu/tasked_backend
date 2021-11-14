import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReqUser } from 'src/common/req-user.decorator';
import { FlushDbRequired } from 'src/core/flush-db-required.decorator';
import { User } from 'src/users/entities/user.entity';

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
  async tasks(@Args() args: QueryTasksArgs, @ReqUser() user: User) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Task)
  async task(@Args() args: QueryTaskArgs, @ReqUser() user: User) {
    return this.service.queryOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Task)
  async createTask(@Args() args: CreateTaskArgs, @ReqUser() user: User) {
    return this.service.createOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Task)
  async updateTask(@Args() args: UpdateTaskArgs, @ReqUser() user: User) {
    return this.service.updateOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Task)
  async deleteTask(@Args() args: DeleteTaskArgs, @ReqUser() user: User) {
    return this.service.deleteOne(user, args);
  }
}
