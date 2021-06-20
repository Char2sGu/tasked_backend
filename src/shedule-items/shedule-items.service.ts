import { EntityData } from '@mikro-orm/core';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { User } from 'src/users/entities/user.entity';
import { CreateSheduleItemDto } from './dto/create-shedule-item.dto';
import { UpdateSheduleItemDto } from './dto/update-shedule-item.dto';
import { SheduleItem } from './entities/shedule-item.entity';

@Injectable()
export class SheduleItemsService extends new MikroCrudServiceFactory({
  entityClass: SheduleItem,
  dtoClasses: { create: CreateSheduleItemDto, update: UpdateSheduleItemDto },
}).product {
  @Inject()
  classroomsService: ClassroomsService;

  async create({
    data,
    user,
  }: {
    data: CreateSheduleItemDto | EntityData<SheduleItem>;
    user: User;
  }) {
    const classroom = await this.classroomsService
      .retrieve({
        conditions: { id: data.classroom },
        user,
      })
      .catch(() => {
        throw new BadRequestException();
      });
    if (user != classroom.creator) throw new ForbiddenException();

    return await super.create({ data, user });
  }

  async update({
    entity: sheduleItem,
    data,
    user,
  }: {
    entity: SheduleItem;
    data: UpdateSheduleItemDto | EntityData<SheduleItem>;
    user: User;
  }) {
    await sheduleItem.classroom.init();
    if (user != sheduleItem.classroom.creator) throw new ForbiddenException();

    return await super.update({ entity: sheduleItem, data, user });
  }

  async destroy({
    entity: sheduleItem,
    user,
  }: {
    entity: SheduleItem;
    user: User;
  }) {
    await sheduleItem.classroom.init();
    if (user != sheduleItem.classroom.creator) throw new ForbiddenException();

    return await super.destroy({ entity: sheduleItem, user });
  }
}
