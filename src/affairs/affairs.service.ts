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
        'Only the creator is allowed to create affairs',
      );

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
    await affair.classroom.init();
    if (user != affair.classroom.creator)
      throw new ForbiddenException(
        'Only the creator is allowed to update affairs',
      );

    return await super.update({ entity: affair, data, user });
  }

  async destroy({ entity: affair, user }: { entity: Affair; user: User }) {
    await affair.classroom.init();
    if (user != affair.classroom.creator)
      throw new ForbiddenException(
        'Only the creator is allowed to destroy affairs',
      );

    return await super.destroy({ entity: affair, user });
  }
}
