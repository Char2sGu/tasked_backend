import { EntityData } from '@mikro-orm/core';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { User } from 'src/users/entities/user.entity';

import { CreateAffairDto } from './dto/create-affair.dto';
import { UpdateAffairDto } from './dto/update-affair.dto';
import { Affair } from './entities/affair.entity';

@Injectable()
export class AffairsService extends new MikroCrudServiceFactory({
  entityClass: Affair,
  dtoClasses: { create: CreateAffairDto, update: UpdateAffairDto },
}).product {
  @Inject()
  classroomsService: ClassroomsService;

  async create({
    data,
    user,
  }: {
    data: CreateAffairDto | EntityData<Affair>;
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
    data: UpdateAffairDto | EntityData<Affair>;
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
