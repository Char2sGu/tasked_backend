import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { UseAccessPolicies } from 'nest-access-policy';
import { AccessPolicyGuard } from 'src/common/access-policy/access-policy.guard';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { User } from 'src/users/entities/user.entity';

import { CRUD_FILTERS } from '../common/crud-filters/crud-filters.token';
import { ReqUser } from '../common/req-user.decorator';
import { AssignmentsAccessPolicy } from './assignments.access-policy';
import { AssignmentsService } from './assignments.service';
import { CompleteAssignmentArgs } from './dto/complete-assignment.args';
import { CreateAssignmentArgs } from './dto/create-assignment.args';
import { DeleteAssignmentArgs } from './dto/delete-assignment.args';
import { PaginatedAssignments } from './dto/paginated-assignments.dto';
import { QueryAssignmentArgs } from './dto/query-assignment.args';
import { QueryAssignmentsArgs } from './dto/query-assignments.args';
import { UpdateAssignmentArgs } from './dto/update-assignment.args';
import { Assignment } from './entities/assignment.entity';

@UseAccessPolicies(AssignmentsAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Resolver(() => Assignment)
export class AssignmentsResolver {
  @Inject()
  service: AssignmentsService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  @Query(() => PaginatedAssignments, {
    name: 'assignments',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryAssignmentsArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: this.filters(user) },
    );
  }

  @Query(() => Assignment, {
    name: 'assignment',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryAssignmentArgs) {
    return this.service.retrieve(id, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Assignment, {
    name: 'createAssignment',
  })
  async createOne(
    @ReqUser() user: User,
    @Args() { data }: CreateAssignmentArgs,
  ) {
    return this.service.create({ ...data, creator: user });
  }

  @FlushDb()
  @Mutation(() => Assignment, {
    name: 'updateAssignment',
  })
  async updateOne(
    @ReqUser() user: User,
    @Args() { id, data }: UpdateAssignmentArgs,
  ) {
    return this.service.update(id, data, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Assignment, {
    name: 'deleteAssignment',
  })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteAssignmentArgs) {
    return this.service.destroy(id, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Assignment, {
    name: 'completeAssignment',
  })
  async completeOne(
    @ReqUser() user: User,
    @Args() { id }: CompleteAssignmentArgs,
  ) {
    return this.service.update(
      { id },
      { isCompleted: true },
      { filters: this.filters(user) },
    );
  }

  @ResolveField(() => Assignment, 'recipient')
  resolveRecipient(@Parent() entity: Assignment) {
    return entity.recipient.init();
  }

  @ResolveField(() => Assignment, 'classroom')
  resolveClassroom(@Parent() entity: Assignment) {
    return entity.classroom.init();
  }

  @ResolveField(() => Assignment, 'task')
  resolveTask(@Parent() entity: Assignment) {
    return entity.task.init();
  }
}
