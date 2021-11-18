import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from 'src/memberships/entities/role.enum';
import { Repository } from 'src/mikro/repository.class';
import { CRUD_FILTER } from 'src/mikro-filters/mikro-filters.constants';
import { User } from 'src/users/entities/user.entity';

import { CreateClassroomArgs } from './dto/create-classroom.args';
import { DeleteClassroomArgs } from './dto/delete-classroom.args';
import { QueryClassroomArgs } from './dto/query-classroom.args';
import { QueryClassroomsArgs } from './dto/query-classrooms.args';
import { UpdateClassroomArgs } from './dto/update-classroom.args';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom) private repo: Repository<Classroom>,
  ) {}

  async queryMany(
    user: User,
    { limit, offset, isOpen, isJoined }: QueryClassroomsArgs,
    query: FilterQuery<Classroom> = {},
  ) {
    return this.repo.findAndPaginate(
      {
        $and: [
          query,
          isOpen != undefined ? { isOpen } : {},
          isJoined != undefined ? { memberships: { owner: user } } : {},
        ],
      },
      {
        limit,
        offset,
        filters: [CRUD_FILTER],
        orderBy: { id: 'ASC' }, // the order will be messy for some unknown reasons when the filters are enabled
      },
    );
  }

  async queryOne(user: User, { id }: QueryClassroomArgs) {
    return this.repo.findOneOrFail(id, { filters: [CRUD_FILTER] });
  }

  async createOne(user: User, { data }: CreateClassroomArgs) {
    const QUOTA = 20;
    const createdCount = await this.repo.count({ creator: user });
    if (createdCount >= QUOTA)
      throw new ForbiddenException(
        `Cannot create more than ${QUOTA} classrooms`,
      );

    return this.repo.create({
      creator: user,
      memberships: [{ owner: user, role: Role.Teacher }],
      isOpen: true,
      ...data,
    });
  }

  async updateOne(user: User, { id, data }: UpdateClassroomArgs) {
    const classroom = await this.repo.findOneOrFail(id, {
      filters: [CRUD_FILTER],
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot update classrooms not created by you',
      );

    return classroom.assign(data);
  }

  async deleteOne(user: User, { id }: DeleteClassroomArgs) {
    const classroom = await this.repo.findOneOrFail(id, {
      filters: [CRUD_FILTER],
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot delete classrooms not created by you',
      );

    await this.repo.populate(classroom, [
      'joinApplications',
      'memberships',
      'tasks',
      'tasks.assignments',
    ]);

    return this.repo.delete(classroom);
  }
}
