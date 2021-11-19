import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { FilterName } from 'src/common/filter-name.enum';
import { Context } from 'src/context/context.class';
import { Role } from 'src/memberships/entities/role.enum';
import { QuotaService } from 'src/mikro/quota.service';
import { Repository } from 'src/mikro/repository.class';

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
    private quotaService: QuotaService,
  ) {}

  async queryMany(
    { limit, offset, isOpen, isJoined }: QueryClassroomsArgs,
    query: FilterQuery<Classroom> = {},
  ) {
    const user = Context.current.user;

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
        filters: [FilterName.CRUD],
        orderBy: { id: 'ASC' }, // the order will be messy for some unknown reasons when the filters are enabled
      },
    );
  }

  async queryOne({ id }: QueryClassroomArgs) {
    return this.repo.findOneOrFail(id, { filters: [FilterName.CRUD] });
  }

  async createOne({ data }: CreateClassroomArgs) {
    const user = Context.current.user;
    await this.quotaService.check(Classroom);
    return this.repo.create({
      creator: user,
      memberships: [{ owner: user, role: Role.Teacher }],
      isOpen: true,
      ...data,
    });
  }

  async updateOne({ id, data }: UpdateClassroomArgs) {
    const user = Context.current.user;

    const classroom = await this.repo.findOneOrFail(id, {
      filters: [FilterName.CRUD],
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot update classrooms not created by you',
      );

    return classroom.assign(data);
  }

  async deleteOne({ id }: DeleteClassroomArgs) {
    const user = Context.current.user;

    const classroom = await this.repo.findOneOrFail(id, {
      filters: [FilterName.CRUD],
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
