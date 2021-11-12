import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { FlushDbRequired } from 'src/common/flush-db/flush-db-required.decorator';
import { ResolveField } from 'src/common/utilities/resolve-field.decorator';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

import { ReqUser } from '../shared/req-user.decorator';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentArgs } from './dto/create-assignment.args';
import { DeleteAssignmentArgs } from './dto/delete-assignment.args';
import { PaginatedAssignments } from './dto/paginated-assignments.dto';
import { QueryAssignmentArgs } from './dto/query-assignment.args';
import { QueryAssignmentsArgs } from './dto/query-assignments.args';
import { UpdateAssignmentArgs } from './dto/update-assignment.args';
import { Assignment } from './entities/assignment.entity';

@Resolver(() => Assignment)
export class AssignmentsResolver {
  @Inject()
  private service: AssignmentsService;

  @Query(() => PaginatedAssignments, {
    name: 'assignments',
  })
  async queryMany(@ReqUser() user: User, @Args() args: QueryAssignmentsArgs) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Assignment, {
    name: 'assignment',
  })
  async queryOne(@ReqUser() user: User, @Args() args: QueryAssignmentArgs) {
    return this.service.queryOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Assignment, {
    name: 'createAssignment',
  })
  async createOne(@Args() args: CreateAssignmentArgs) {
    return this.service.createOne(args);
  }

  @FlushDbRequired()
  @Mutation(() => Assignment, {
    name: 'updateAssignment',
  })
  async updateOne(@ReqUser() user: User, @Args() args: UpdateAssignmentArgs) {
    return this.service.updateOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Assignment, {
    name: 'deleteAssignment',
  })
  async deleteOne(@ReqUser() user: User, @Args() args: DeleteAssignmentArgs) {
    return this.service.deleteOne(user, args);
  }

  @ResolveField(() => Assignment, 'recipient', () => User)
  async resolveRecipient(@Parent() entity: Assignment) {
    return entity.recipient.init();
  }

  @ResolveField(() => Assignment, 'classroom', () => Classroom)
  async resolveClassroom(@Parent() entity: Assignment) {
    return entity.classroom.init();
  }

  @ResolveField(() => Assignment, 'task', () => Task)
  async resolveTask(@Parent() entity: Assignment) {
    return entity.task.init();
  }
}
