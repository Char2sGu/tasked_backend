import { QueryOrder } from '@mikro-orm/core';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { CrudService } from 'src/common/crud/crud.service';
import { User } from 'src/users/entities/user.entity';

import { CreateAffairArgs } from './dto/create-affair.args';
import { DeleteAffairArgs } from './dto/delete-affair.args';
import { QueryAffairArgs } from './dto/query-affair.args';
import { QueryAffairsArgs } from './dto/query-affairs.args';
import { UpdateAffairArgs } from './dto/update-affair.args';
import { Affair } from './entities/affair.entity';

@Injectable()
export class AffairsService extends CrudService.of(Affair) {
  @Inject()
  private classrooms: ClassroomsService;

  async queryMany(
    user: User,
    { limit, offset, isActivated }: QueryAffairsArgs,
  ) {
    return this.list(
      { ...(isActivated != undefined ? { isActivated } : null) },
      {
        limit,
        offset,
        filters: { visible: { user } },
        orderBy: { date: QueryOrder.DESC },
      },
    );
  }

  async queryOne(user: User, { id }: QueryAffairArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne(user: User, { data }: CreateAffairArgs) {
    const classroom = await this.classrooms.retrieve(data.classroom, {
      filters: { visible: { user } },
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot create affairs in classrooms not created by you',
      );

    return this.create({ ...data });
  }

  async updateOne(user: User, { id, data }: UpdateAffairArgs) {
    const affair = await this.retrieve(id, {
      filters: { visible: { user } },
      populate: ['classroom'],
    });

    if (user != affair.classroom.creator)
      throw new ForbiddenException(
        'Cannot update affairs of classrooms not created by you',
      );

    return this.update(affair, data);
  }

  async deleteOne(user: User, { id }: DeleteAffairArgs) {
    const affair = await this.retrieve(id, {
      filters: { visible: { user } },
      populate: ['classroom'],
    });

    if (affair)
      throw new ForbiddenException(
        'Cannot delete affairs of classrooms not created by you',
      );

    return this.destroy(affair);
  }
}
