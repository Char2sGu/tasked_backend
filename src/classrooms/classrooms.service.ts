import { FilterQuery, FindOneOrFailOptions } from '@mikro-orm/core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud.service';
import { Role } from 'src/memberships/entities/role.enum';
import { User } from 'src/users/entities/user.entity';

import { CreateClassroomArgs } from './dto/create-classroom.args';
import { DeleteClassroomArgs } from './dto/delete-classroom.args';
import { QueryClassroomArgs } from './dto/query-classroom.args';
import { QueryClassroomsArgs } from './dto/query-classrooms.args';
import { UpdateClassroomArgs } from './dto/update-classroom.args';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService extends CrudService.of(Classroom) {
  async queryMany(
    user: User,
    { limit, offset, isOpen, isJoined }: QueryClassroomsArgs,
    query: FilterQuery<Classroom> = {},
  ) {
    return this.list(
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
        filters: { visible: { user } },
        orderBy: { id: 'ASC' }, // the order will be messy for some unknown reasons when the filters are enabled
      },
    );
  }

  async queryOne(user: User, { id }: QueryClassroomArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne(user: User, { data }: CreateClassroomArgs) {
    const QUOTA = 20;
    const createdCount = await this.count({ creator: user });
    if (createdCount >= QUOTA)
      throw new ForbiddenException(
        `Cannot create more than ${QUOTA} classrooms`,
      );

    return this.create({
      creator: user,
      memberships: [{ owner: user, role: Role.Teacher }],
      isOpen: true,
      ...data,
    });
  }

  async updateOne(user: User, { id, data }: UpdateClassroomArgs) {
    const classroom = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot update classrooms not created by you',
      );

    return this.update(classroom, data);
  }

  async deleteOne(user: User, { id }: DeleteClassroomArgs) {
    const classroom = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot delete classrooms not created by you',
      );

    return this.destroy(classroom);
  }

  async destroy(
    where: FilterQuery<Classroom>,
    options?: FindOneOrFailOptions<Classroom>,
  ) {
    const entity = await this.retrieve(where, options);
    entity.deletedAt = new Date();
    return entity;
  }
}
