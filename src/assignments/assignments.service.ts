import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { CrudService } from 'src/shared/crud.service';
import { User } from 'src/users/entities/user.entity';

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
    { limit, offset, isOwn, ...filters }: QueryAssignmentsArgs,
    query: FilterQuery<Assignment> = {},
  ) {
    return this.list(
      {
        $and: [
          query,
          filters,
          isOwn == undefined
            ? {}
            : { recipient: isOwn ? user : { $not: user } },
        ],
      },
      {
        limit,
        offset,
        orderBy: { createdAt: QueryOrder.DESC },
        filters: { visible: { user } },
      },
    );
  }

  async queryOne(user: User, { id }: QueryAssignmentArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne({ data }: CreateAssignmentArgs) {
    return this.create({
      isPublic: false,
      isCompleted: false,
      isImportant: false,
      ...data,
    });
  }

  async updateOne(user: User, { id, data }: UpdateAssignmentArgs) {
    const assignment = await this.retrieve(id, {
      filters: { visible: { user } },
      populate: ['task'],
    });

    if (user != assignment.task.creator) {
      if (isDefined(data.isPublic))
        throw new ForbiddenException(
          'Cannot update publicness of assignments not created by you',
        );
    }
    if (user != assignment.recipient) {
      if (isDefined(data.isCompleted))
        throw new ForbiddenException(
          'Cannot update completeness of assignments not assigned to you',
        );
      if (isDefined(data.isImportant))
        throw new ForbiddenException(
          'Cannot update importance of assignments not assigned to you',
        );
    }

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
}
