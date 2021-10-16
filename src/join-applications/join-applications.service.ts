import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';

import { AcceptJoinApplicationArgs } from './dto/accept-join-application.args';
import { CreateJoinApplicationArgs } from './dto/create-join-application.args';
import { QueryJoinApplicationArgs } from './dto/query-join-application.args';
import { QueryJoinApplicationsArgs } from './dto/query-join-applications.args';
import { RejectJoinApplicationArgs } from './dto/reject-join-application.args';
import { UpdateJoinApplicationArgs } from './dto/update-join-application.args';
import { ApplicationStatus } from './entities/application-status.enum';
import { JoinApplication } from './entities/join-application.entity';

@Injectable()
export class JoinApplicationsService extends CrudService.of(JoinApplication) {
  @Inject()
  private memberships: MembershipsService;

  async queryMany(user: User, { limit, offset }: QueryJoinApplicationsArgs) {
    return this.list({}, { limit, offset, filters: { visible: { user } } });
  }

  async queryOne(user: User, { id }: QueryJoinApplicationArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async createOne(user: User, { data }: CreateJoinApplicationArgs) {
    return this.create({ ...data, owner: user });
  }

  async updateOne(user: User, { id, data }: UpdateJoinApplicationArgs) {
    const application = await this.retrieve(id, {
      filters: { visible: { user } },
    });

    if (application.owner != user)
      throw new ForbiddenException(
        'Cannot update applications created by others',
      );
    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot update resulted applications');

    return this.update(application, data);
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
      role: application.role,
    });

    return { application, membership };
  }
}
