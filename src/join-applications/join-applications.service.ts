import { EntityData } from '@mikro-orm/core';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';
import { ApplicationStatus } from './application-status.enum';
import { CreateJoinApplicationDto } from './dto/create-join-application.dto';
import { UpdateJoinApplicationDto } from './dto/update-join-application.dto';
import { JoinApplication } from './entities/join-application.entity';

@Injectable()
export class JoinApplicationsService extends new MikroCrudServiceFactory({
  entityClass: JoinApplication,
  dtoClasses: {
    create: CreateJoinApplicationDto,
    update: UpdateJoinApplicationDto,
  },
}).product {
  @Inject()
  membershipsService: MembershipsService;

  async create({
    data,
    user,
  }: {
    data: CreateJoinApplicationDto | EntityData<JoinApplication>;
    user: User;
  }) {
    const { classroom } = data;

    if (await this.membershipsService.exists({ classroom, user }))
      throw new BadRequestException('Already a member of this classroom');
    if (await this.isPending({ classroom, user }))
      throw new BadRequestException(
        'A pending application already exists in this classroom',
      );
    return await super.create({
      data: {
        ...data,
        owner: user,
        status: ApplicationStatus.Pending,
      },
      user,
    });
  }

  async update({
    data,
    entity: application,
    user,
  }: {
    data: UpdateJoinApplicationDto;
    entity: JoinApplication;
    user: User;
  }) {
    application = await super.update({ data, entity: application, user });

    if (data.status == ApplicationStatus.Accepted) {
      const { classroom, role, owner } = application;
      await this.membershipsService.create({
        data: { classroom, role },
        user: owner,
      });
    }

    return application;
  }

  async isPending({ classroom, user }: { classroom: Classroom; user: User }) {
    try {
      await this.retrieve({
        conditions: {
          owner: user,
          classroom,
          status: ApplicationStatus.Pending,
        },
        user,
      });
      return true;
    } catch {
      return false;
    }
  }
}
