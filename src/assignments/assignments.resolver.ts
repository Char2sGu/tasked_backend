import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

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
  constructor(private service: AssignmentsService) {}

  @Query(() => PaginatedAssignments)
  async assignments(@Args() args: QueryAssignmentsArgs) {
    return this.service.queryMany(args);
  }

  @Query(() => Assignment)
  async assignment(@Args() args: QueryAssignmentArgs) {
    return this.service.queryOne(args);
  }

  @Mutation(() => Assignment)
  async createAssignment(@Args() args: CreateAssignmentArgs) {
    return await this.service.createOne(args);
  }

  @Mutation(() => Assignment)
  async updateAssignment(@Args() args: UpdateAssignmentArgs) {
    return this.service.updateOne(args);
  }

  @Mutation(() => Assignment)
  async deleteAssignment(@Args() args: DeleteAssignmentArgs) {
    return this.service.deleteOne(args);
  }
}
