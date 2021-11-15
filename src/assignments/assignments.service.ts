import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isDefined } from 'class-validator';
import { CrudService } from 'src/crud/crud.service';
import { Role } from 'src/memberships/entities/role.enum';
import { MembershipsService } from 'src/memberships/memberships.service';
import { CRUD_FILTER } from 'src/mikro/mikro-filters.constants';
import { TasksService } from 'src/tasks/tasks.service';
import { User } from 'src/users/entities/user.entity';

import { CreateAssignmentArgs } from './dto/create-assignment.args';
import { DeleteAssignmentArgs } from './dto/delete-assignment.args';
import { QueryAssignmentArgs } from './dto/query-assignment.args';
import { QueryAssignmentsArgs } from './dto/query-assignments.args';
import { UpdateAssignmentArgs } from './dto/update-assignment.args';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    public crud: CrudService<Assignment>,
    private membershipsService: MembershipsService,
    private tasksService: TasksService,
  ) {}

  async queryMany(
    user: User,
    { limit, offset, isOwn, ...filters }: QueryAssignmentsArgs,
    query: FilterQuery<Assignment> = {},
  ) {
    return this.crud.list(
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
        filters: [CRUD_FILTER],
      },
    );
  }

  async queryOne(user: User, { id }: QueryAssignmentArgs) {
    return this.crud.retrieve(id, { filters: [CRUD_FILTER] });
  }

  async createOne(user: User, { data }: CreateAssignmentArgs) {
    await this.membershipsService.crud.retrieve(
      {
        owner: data.recipient,
        role: Role.Student,
      },
      {
        filters: [CRUD_FILTER],
        failHandler: () =>
          new BadRequestException(
            'recipient must be an ID of a user being a student in this classroom',
          ),
      },
    );

    await this.tasksService.crud.retrieve(
      { id: data.task, creator: user },
      {
        filters: [CRUD_FILTER],
        failHandler: () =>
          new BadRequestException(
            'task must be an ID of a task created by you',
          ),
      },
    );

    return this.crud.create({
      isPublic: false,
      isCompleted: false,
      isImportant: false,
      ...data,
    });
  }

  async updateOne(user: User, { id, data }: UpdateAssignmentArgs) {
    const assignment = await this.crud.retrieve(id, {
      filters: [CRUD_FILTER],
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

    return this.crud.update(assignment, data);
  }

  async deleteOne(user: User, { id }: DeleteAssignmentArgs) {
    const assignment = await this.crud.retrieve(id, {
      filters: [CRUD_FILTER],
      populate: ['task'],
    });

    if (user != assignment.task.creator)
      throw new ForbiddenException(
        'Cannot delete assignments not created by you',
      );

    return this.crud.destroy(assignment);
  }
}
