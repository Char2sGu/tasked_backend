import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FlushDbRequired } from 'src/shared/flush-db-required.decorator';
import { User } from 'src/users/entities/user.entity';

import { ReqUser } from '../common/req-user.decorator';
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

  @Query(() => PaginatedAssignments)
  async assignments(@Args() args: QueryAssignmentsArgs, @ReqUser() user: User) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Assignment)
  async assignment(@Args() args: QueryAssignmentArgs, @ReqUser() user: User) {
    return this.service.queryOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Assignment)
  async createAssignment(
    @Args() args: CreateAssignmentArgs,
    @ReqUser() user: User,
  ) {
    return this.service.createOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Assignment)
  async updateAssignment(
    @Args() args: UpdateAssignmentArgs,
    @ReqUser() user: User,
  ) {
    return this.service.updateOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Assignment)
  async deleteAssignment(
    @Args() args: DeleteAssignmentArgs,
    @ReqUser() user: User,
  ) {
    return this.service.deleteOne(user, args);
  }
}
