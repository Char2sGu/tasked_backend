import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { CrudService } from 'src/crud/crud.service';
import { CRUD_FILTER } from 'src/crud/crud-filter.constant';
import { Role } from 'src/memberships/entities/role.enum';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';

import { AcceptJoinApplicationArgs } from './dto/accept-join-application.args';
import { CreateJoinApplicationArgs } from './dto/create-join-application.args';
import { QueryJoinApplicationArgs } from './dto/query-join-application.args';
import { QueryJoinApplicationsArgs } from './dto/query-join-applications.args';
import { RejectJoinApplicationArgs } from './dto/reject-join-application.args';
import { ApplicationStatus } from './entities/application-status.enum';
import { JoinApplication } from './entities/join-application.entity';

@Injectable()
export class JoinApplicationsService {
  constructor(
    public crud: CrudService<JoinApplication>,
    private membershipsService: MembershipsService,
    private classroomsService: ClassroomsService,
  ) {}

  async queryMany(
    user: User,
    { limit, offset, isPending }: QueryJoinApplicationsArgs,
    query: FilterQuery<JoinApplication> = {},
  ) {
    return this.crud.list(
      {
        $and: [
          query,
          isPending != undefined
            ? {
                status: isPending
                  ? { $eq: ApplicationStatus.Pending }
                  : { $not: ApplicationStatus.Pending },
              }
            : {},
        ],
      },
      {
        limit,
        offset,
        filters: { [CRUD_FILTER]: { user } },
        orderBy: { id: QueryOrder.DESC },
      },
    );
  }

  async queryOne(user: User, { id }: QueryJoinApplicationArgs) {
    return this.crud.retrieve(id, { filters: { [CRUD_FILTER]: { user } } });
  }

  async createOne(user: User, { data }: CreateJoinApplicationArgs) {
    await this.classroomsService.crud
      .retrieve(
        {
          id: data.classroom,
          $or: [
            { joinApplications: { owner: user } },
            { memberships: { owner: user } },
          ],
        },
        { failHandler: false },
      )
      .then((result) => {
        if (result)
          throw new BadRequestException(
            'classroom must be an ID of a classroom in which you have no membership or application',
          );
      });

    await this.classroomsService.crud.retrieve(data.classroom, {
      failHandler: () =>
        new BadRequestException(
          'classroom must be an ID of an existing classroom',
        ),
    });

    return this.crud.create({
      owner: user,
      status: ApplicationStatus.Pending,
      ...data,
    });
  }

  async rejectOne(user: User, { id }: RejectJoinApplicationArgs) {
    const application = await this.crud.retrieve(id, {
      filters: { [CRUD_FILTER]: { user } },
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot reject resulted applications');

    return this.crud.update(application, {
      status: ApplicationStatus.Rejected,
    });
  }

  async acceptOne(user: User, { id }: AcceptJoinApplicationArgs) {
    const application = await this.crud.retrieve(id, {
      filters: { [CRUD_FILTER]: { user } },
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot accept resulted applications');

    await this.crud.update(application, {
      status: ApplicationStatus.Accepted,
    });

    const membership = await this.membershipsService.crud.create({
      owner: application.owner,
      classroom: application.classroom,
      role: Role.Student,
    });

    return { application, membership };
  }
}
