import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { MembershipsService } from 'src/memberships/memberships.service';
import { Role } from 'src/memberships/role.enum';
import { User } from 'src/users/entities/user.entity';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService extends new MikroCrudServiceFactory({
  entityClass: Classroom,
  dtoClasses: { create: CreateClassroomDto, update: UpdateClassroomDto },
}).product {
  @Inject() membershipsService: MembershipsService;

  async create({ data, user }: { data: CreateClassroomDto; user: User }) {
    const classroom = await super.create({
      data: { ...data, creator: user },
      user,
    });

    await this.membershipsService.create({
      data: {
        owner: user,
        classroom,
        role: Role.Teacher,
      },
      user,
    });

    return classroom;
  }

  async update({
    entity: classroom,
    data,
    user,
  }: {
    entity: Classroom;
    data: UpdateClassroomDto;
    user: User;
  }) {
    if (user != classroom.creator)
      throw new ForbiddenException('Only the creator can update the classroom');
    return await super.update({ entity: classroom, data, user });
  }

  async destroy({
    entity: classroom,
    user,
  }: {
    entity: Classroom;
    user: User;
  }) {
    if (user != classroom.creator)
      throw new ForbiddenException(
        'Only the creator can destroy the classroom',
      );
    return await super.destroy({ entity: classroom, user });
  }
}
