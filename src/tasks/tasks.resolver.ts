import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ResolveField } from 'src/common/utilities/resolve-field.decorator';
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
  @Inject()
  private service: TasksService;

  @Inject()
  private assignments: AssignmentsService;

  @Query(() => PaginatedTasks, {
    name: 'tasks',
  })
  async queryMany(@ReqUser() user: User, @Args() args: QueryTasksArgs) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Task, {
    name: 'task',
  })
  async queryOne(@ReqUser() user: User, @Args() args: QueryTaskArgs) {
    return this.service.queryOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Task, {
    name: 'createTask',
  })
  async createOne(@ReqUser() user: User, @Args() args: CreateTaskArgs) {
    return this.service.createOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Task, {
    name: 'updateTask',
  })
  async updateOne(@ReqUser() user: User, @Args() args: UpdateTaskArgs) {
    return this.service.updateOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Task, {
    name: 'deleteTask',
  })
  async deleteOne(@ReqUser() user: User, @Args() args: DeleteTaskArgs) {
    return this.service.deleteOne(user, args);
  }

  @ResolveField(() => Task, 'creator', () => User)
  async resolveCreator(@Parent() entity: Task) {
    return entity.creator.init();
  }

  @ResolveField(() => Task, 'assignments', () => Assignment)
  async resolveAssignments(
    @ReqUser() user: User,
    @Parent() entity: Task,
    @Args() args: QueryAssignmentsArgs,
  ) {
    return this.assignments.queryMany(user, args, { classroom: entity });
  }
}
