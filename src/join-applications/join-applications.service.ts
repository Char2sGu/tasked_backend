import { EntityData } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
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
}
