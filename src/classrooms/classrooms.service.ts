import { Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { Role } from 'src/memberships/entities/role.enum';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';

import { ClassroomCreateInput } from './dto/classroom-create.input';
import { ClassroomUpdateInput } from './dto/classroom-update.input';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService extends new MikroCrudServiceFactory({
  entityClass: Classroom,
  dtoClasses: { create: ClassroomCreateInput, update: ClassroomUpdateInput },
}).product {
  @Inject()
  membershipsService: MembershipsService;

  async create({ data, user }: { data: ClassroomCreateInput; user: User }) {
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
}
