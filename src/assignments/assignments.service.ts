import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isDefined } from 'class-validator';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Context } from 'src/context/context.class';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { Repository } from 'src/mikro/repository.class';
import { Task } from 'src/tasks/entities/task.entity';

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
    { limit, offset, isOwn, ...filters }: QueryAssignmentsArgs,
    query: FilterQuery<Assignment> = {},
  ) {
    const user = Context.current.user;

    return this.repo.findAndPaginate(
      {
        $and: [
          query,
          filters,
          isOwn == undefined
            ? {}
            : { recipient: { owner: isOwn ? user : { $not: user } } },
        ],
      },
      {
        limit,
        offset,
        orderBy: { id: QueryOrder.DESC },
        filters: [CommonFilter.Crud],
      },
    );
  }

  async queryOne({ id }: QueryAssignmentArgs) {
    return this.repo.findOneOrFail(id, { filters: [CommonFilter.Crud] });
  }

  async createOne({ data }: CreateAssignmentArgs) {
    const user = Context.current.user;

    await this.membershipRepo.findOneOrFail(
      { id: data.recipient, role: Role.Student },
      {
        filters: [CommonFilter.Crud],
        failHandler: () =>
          new BadRequestException(
            'recipient must be an ID of a student membership in this room',
          ),
      },
    );

    await this.taskRepo.findOneOrFail(
      { id: data.task, creator: user },
      {
        filters: [CommonFilter.Crud],
        failHandler: () =>
          new BadRequestException(
            'task must be an ID of a task created by you',
          ),
      },
    );

    return this.repo.create({
      isCompleted: false,
      isImportant: false,
      ...data,
    });
  }

  async updateOne({ id, data }: UpdateAssignmentArgs) {
    const user = Context.current.user;

    const assignment = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
      populate: ['task', 'recipient'],
    });

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

  async deleteOne({ id }: DeleteAssignmentArgs) {
    const user = Context.current.user;

    const assignment = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
      populate: ['task'],
    });

    if (user != assignment.task.creator)
      throw new ForbiddenException(
        'Cannot delete assignments not created by you',
      );

    return this.repo.delete(assignment);
  }
}
