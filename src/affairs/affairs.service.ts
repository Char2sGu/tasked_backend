import { EntityData } from '@mikro-orm/core';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { User } from 'src/users/entities/user.entity';

import { AffairCreateInput } from './dto/affair-create.input';
import { AffairUpdateInput } from './dto/affair-update.input';
import { Affair } from './entities/affair.entity';

@Injectable()
export class AffairsService extends new MikroCrudServiceFactory({
  entityClass: Affair,
  dtoClasses: { create: AffairCreateInput, update: AffairUpdateInput },
}).product {
  @Inject()
  classroomsService: ClassroomsService;

  async create({
    data,
    user,
  }: {
    data: AffairCreateInput | EntityData<Affair>;
    user: User;
  }) {
    await this.validate({ data });
    return await super.create({ data, user });
  }

  async update({
    entity: affair,
    data,
    user,
  }: {
    entity: Affair;
    data: AffairUpdateInput | EntityData<Affair>;
    user: User;
  }) {
    await super.update({ entity: affair, data, user });
    await this.validate({ data: affair });
    return affair;
  }

  async validate({ data }: { data: EntityData<Affair> }) {
    if (data.timeEnd <= data.timeStart)
      throw new BadRequestException(
        'The start time must be earlier than the end time',
      );
  }
}
