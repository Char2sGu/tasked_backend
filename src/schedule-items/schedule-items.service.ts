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
import { CreateScheduleItemDto } from './dto/create-schedule-item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule-item.dto';
import { ScheduleItem } from './entities/schedule-item.entity';

@Injectable()
export class ScheduleItemsService extends new MikroCrudServiceFactory({
  entityClass: ScheduleItem,
  dtoClasses: { create: CreateScheduleItemDto, update: UpdateScheduleItemDto },
}).product {
  @Inject()
  classroomsService: ClassroomsService;

  async create({
    data,
    user,
  }: {
    data: CreateScheduleItemDto | EntityData<ScheduleItem>;
    user: User;
  }) {
    const classroom = await this.classroomsService
      .retrieve({
        conditions: { id: data.classroom },
        user,
      })
      .catch(() => {
        throw new BadRequestException('Classroom not found');
      });
    if (user != classroom.creator)
      throw new ForbiddenException(
        'Only the creator is allowed to create schedule items',
      );

    return await super.create({ data, user });
  }

  async update({
    entity: scheduleItem,
    data,
    user,
  }: {
    entity: ScheduleItem;
    data: UpdateScheduleItemDto | EntityData<ScheduleItem>;
    user: User;
  }) {
    await scheduleItem.classroom.init();
    if (user != scheduleItem.classroom.creator)
      throw new ForbiddenException(
        'Only the creator is allowed to update schedule items',
      );

    return await super.update({ entity: scheduleItem, data, user });
  }

  async destroy({
    entity: scheduleItem,
    user,
  }: {
    entity: ScheduleItem;
    user: User;
  }) {
    await scheduleItem.classroom.init();
    if (user != scheduleItem.classroom.creator)
      throw new ForbiddenException(
        'Only the creator is allowed to destroy schedule items',
      );

    return await super.destroy({ entity: scheduleItem, user });
  }
}
