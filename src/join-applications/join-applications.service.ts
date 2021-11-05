import { FilterQuery } from '@mikro-orm/core';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud.service';
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
export class JoinApplicationsService extends CrudService.of(JoinApplication) {
  @Inject()
  private memberships: MembershipsService;

  async queryMany(
    user: User,
    { limit, offset, isPending }: QueryJoinApplicationsArgs,
    query: FilterQuery<JoinApplication> = {},
  ) {
    return this.list(
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
      { limit, offset, filters: { visible: { user } } },
    );
  }

  async queryOne(user: User, { id }: QueryJoinApplicationArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne(user: User, { data }: CreateJoinApplicationArgs) {
    return this.create({ ...data, owner: user });
  }

  async rejectOne(user: User, { id }: RejectJoinApplicationArgs) {
    const application = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot reject resulted applications');

    return this.update(application, {
      status: ApplicationStatus.Rejected,
    });
  }

  async acceptOne(user: User, { id }: AcceptJoinApplicationArgs) {
    const application = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot accept resulted applications');

    await this.update(application, {
      status: ApplicationStatus.Accepted,
    });

    const membership = await this.memberships.create({
      owner: user,
      classroom: application.classroom,
      role: Role.Student,
    });

    return { application, membership };
  }
}
