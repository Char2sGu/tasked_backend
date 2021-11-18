import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isDefined } from 'class-validator';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { Repository } from 'src/mikro/repository.class';
import { CRUD_FILTER } from 'src/mikro-filters/crud-filter.constant';
import { Task } from 'src/tasks/entities/task.entity';
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
    @InjectRepository(Assignment)
    private repo: Repository<Assignment>,

    @InjectRepository(Membership)
    private membershipRepo: Repository<Membership>,

    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async queryMany(
    user: User,
    { limit, offset, isOwn, ...filters }: QueryAssignmentsArgs,
    query: FilterQuery<Assignment> = {},
  ) {
    return this.repo.findAndPaginate(
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
    return this.repo.findOneOrFail(id, { filters: [CRUD_FILTER] });
  }

  async createOne(user: User, { data }: CreateAssignmentArgs) {
    await this.membershipRepo.findOneOrFail(
      { id: data.recipient, role: Role.Student },
      {
        filters: [CRUD_FILTER],
        failHandler: () =>
          new BadRequestException(
            'recipient must be an ID of a student membership in this classroom',
          ),
      },
    );

    await this.taskRepo.findOneOrFail(
      { id: data.task, creator: user },
      {
        filters: [CRUD_FILTER],
        failHandler: () =>
          new BadRequestException(
            'task must be an ID of a task created by you',
          ),
      },
    );

    return this.repo.create({
      isPublic: false,
      isCompleted: false,
      isImportant: false,
      ...data,
    });
  }

  async updateOne(user: User, { id, data }: UpdateAssignmentArgs) {
    const assignment = await this.repo.findOneOrFail(id, {
      filters: [CRUD_FILTER],
      populate: ['task'],
    });

    if (user != assignment.task.creator) {
      if (isDefined(data.isPublic))
        throw new ForbiddenException(
          'Cannot update publicness of assignments not created by you',
        );
    }
    if (user != assignment.recipient.owner) {
      if (isDefined(data.isCompleted))
        throw new ForbiddenException(
          'Cannot update completeness of assignments not assigned to you',
        );
      if (isDefined(data.isImportant))
        throw new ForbiddenException(
          'Cannot update importance of assignments not assigned to you',
        );
    }

    return assignment.assign(data);
  }

  async deleteOne(user: User, { id }: DeleteAssignmentArgs) {
    const assignment = await this.repo.findOneOrFail(id, {
      filters: [CRUD_FILTER],
      populate: ['task'],
    });

    if (user != assignment.task.creator)
      throw new ForbiddenException(
        'Cannot delete assignments not created by you',
      );

    return this.repo.delete(assignment);
  }
}
