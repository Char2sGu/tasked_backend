import { ForbiddenException, Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
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
  private readonly service: TasksService;

  @Inject()
  private readonly assignmentsService: AssignmentsService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  @Query(() => PaginatedTasks, {
    name: 'tasks',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryTasksArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: this.filters(user) },
    );
  }

  @Query(() => Task, {
    name: 'task',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryTaskArgs) {
    return this.service.retrieve(id, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Task, {
    name: 'createTask',
  })
  async createOne(@ReqUser() user: User, @Args() { data }: CreateTaskArgs) {
    return this.service.create({ ...data, creator: user });
  }

  @FlushDb()
  @Mutation(() => Task, {
    name: 'updateTask',
  })
  async updateOne(@ReqUser() user: User, @Args() { id, data }: UpdateTaskArgs) {
    const entity = await this.service.retrieve(id, {
      filters: this.filters(user),
    });

    if (entity.creator != user)
      throw new ForbiddenException('Cannot update tasks not created by you');

    return this.service.update(id, data);
  }

  @FlushDb()
  @Mutation(() => Task, {
    name: 'deleteTask',
  })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteTaskArgs) {
    const entity = await this.service.retrieve(id, {
      filters: this.filters(user),
    });

    if (entity.creator != user)
      throw new ForbiddenException('Cannot delete tasks not created by you');

    return this.service.destroy(id);
  }

  @ResolveField(() => Task, 'assignments')
  async resolveAssignments(
    @ReqUser() user: User,
    @Parent() entity: Task,
    @Args() { limit, offset }: QueryAssignmentsArgs,
  ) {
    return this.assignmentsService.list(
      { task: entity },
      { limit, offset, filters: this.filters(user) },
    );
  }
}
