import { FilterQuery } from '@mikro-orm/core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';
import { User } from 'src/users/entities/user.entity';

import { CompleteAssignmentArgs } from './dto/complete-assignment.args';
import { CreateAssignmentArgs } from './dto/create-assignment.args';
import { DeleteAssignmentArgs } from './dto/delete-assignment.args';
import { QueryAssignmentArgs } from './dto/query-assignment.args';
import { QueryAssignmentsArgs } from './dto/query-assignments.args';
import { UpdateAssignmentArgs } from './dto/update-assignment.args';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService extends CrudService.of(Assignment) {
  async queryMany(
    user: User,
    { limit, offset, isCompleted, isPublic }: QueryAssignmentsArgs,
    query: FilterQuery<Assignment> = {},
  ) {
    return this.list(
      { $and: [query, { isCompleted, isPublic }] },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  async queryOne(user: User, { id }: QueryAssignmentArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne({ data }: CreateAssignmentArgs) {
    return this.create({ ...data });
  }

  async updateOne(user: User, { id, data }: UpdateAssignmentArgs) {
    const assignment = await this.retrieve(id, {
      filters: { visible: { user } },
      populate: ['task'],
    });

    if (user != assignment.task.creator)
      throw new ForbiddenException(
        'Cannot update assignments not created by you',
      );

    return this.update(assignment, data);
  }

  async deleteOne(user: User, { id }: DeleteAssignmentArgs) {
    const assignment = await this.retrieve(id, {
      filters: { visible: { user } },
      populate: ['task'],
    });

    if (user != assignment.task.creator)
      throw new ForbiddenException(
        'Cannot delete assignments not created by you',
      );

    return this.destroy(assignment);
  }

  async completeOne(user: User, { id }: CompleteAssignmentArgs) {
    const assignment = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (user != assignment.recipient)
      throw new ForbiddenException(
        'Cannot complete assignments not assigned to you',
      );

    return this.update(assignment, { isCompleted: true });
  }
}
