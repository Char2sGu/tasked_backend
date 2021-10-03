import { ForbiddenException, Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

import { ReqUser } from '../common/req-user.decorator';
import { AssignmentsService } from './assignments.service';
import { CompleteAssignmentArgs } from './dto/complete-assignment.args';
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
  service: AssignmentsService;

  @Query(() => PaginatedAssignments, {
    name: 'assignments',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryAssignmentsArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @Query(() => Assignment, {
    name: 'assignment',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryAssignmentArgs) {
    return this.service.retrieve(id, { filters: { visible: { user } } });
  }

  @FlushDb()
  @Mutation(() => Assignment, {
    name: 'createAssignment',
  })
  async createOne(@Args() { data }: CreateAssignmentArgs) {
    return this.service.create({ ...data });
  }

  @FlushDb()
  @Mutation(() => Assignment, {
    name: 'updateAssignment',
  })
  async updateOne(
    @ReqUser() user: User,
    @Args() { id, data }: UpdateAssignmentArgs,
  ) {
    const assignment = await this.service.retrieve(id, {
      filters: { visible: { user } },
      populate: ['task'],
    });

    if (user != assignment.task.creator)
      throw new ForbiddenException(
        'Cannot update assignments not created by you',
      );

    return this.service.update(assignment, data);
  }

  @FlushDb()
  @Mutation(() => Assignment, {
    name: 'deleteAssignment',
  })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteAssignmentArgs) {
    const assignment = await this.service.retrieve(id, {
      filters: { visible: { user } },
      populate: ['task'],
    });

    if (user != assignment.task.creator)
      throw new ForbiddenException(
        'Cannot delete assignments not created by you',
      );

    return this.service.destroy(assignment);
  }

  @FlushDb()
  @Mutation(() => Assignment, {
    name: 'completeAssignment',
  })
  async completeOne(
    @ReqUser() user: User,
    @Args() { id }: CompleteAssignmentArgs,
  ) {
    const assignment = await this.service.retrieve(id, {
      filters: { visible: { user } },
    });

    if (user != assignment.recipient)
      throw new ForbiddenException(
        'Cannot complete assignments not assigned to you',
      );

    return this.service.update(assignment, { isCompleted: true });
  }

  @ResolveField(() => Assignment, 'recipient', () => User)
  resolveRecipient(@Parent() entity: Assignment) {
    return entity.recipient.init();
  }

  @ResolveField(() => Assignment, 'classroom', () => Classroom)
  resolveClassroom(@Parent() entity: Assignment) {
    return entity.classroom.init();
  }

  @ResolveField(() => Assignment, 'task', () => Task)
  resolveTask(@Parent() entity: Assignment) {
    return entity.task.init();
  }
}
