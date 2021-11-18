import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { FilterName } from 'src/common/filter-name.enum';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { Repository } from 'src/mikro/repository.class';
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
    @InjectRepository(JoinApplication)
    private repo: Repository<JoinApplication>,

    @InjectRepository(Membership)
    private membershipRepo: Repository<Membership>,

    @InjectRepository(Classroom)
    private classroomRepo: Repository<Classroom>,
  ) {}

  async queryMany(
    user: User,
    { limit, offset, isPending }: QueryJoinApplicationsArgs,
    query: FilterQuery<JoinApplication> = {},
  ) {
    return this.repo.findAndPaginate(
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
        filters: [FilterName.CRUD],
        orderBy: { id: QueryOrder.DESC },
      },
    );
  }

  async queryOne(user: User, { id }: QueryJoinApplicationArgs) {
    return this.repo.findOneOrFail(id, { filters: [FilterName.CRUD] });
  }

  async createOne(user: User, { data }: CreateJoinApplicationArgs) {
    await this.classroomRepo
      .findOne(
        {
          id: data.classroom,
          $or: [
            { joinApplications: { owner: user } },
            { memberships: { owner: user } },
          ],
        },
        { filters: [FilterName.CRUD] },
      )
      .then((result) => {
        if (result)
          throw new BadRequestException(
            'classroom must be an ID of a classroom in which you have no membership or application',
          );
      });

    return this.repo.create({
      owner: user,
      status: ApplicationStatus.Pending,
      ...data,
    });
  }

  async rejectOne(user: User, { id }: RejectJoinApplicationArgs) {
    const application = await this.repo.findOneOrFail(id, {
      filters: [FilterName.CRUD],
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot reject resulted applications');

    return application.assign({
      status: ApplicationStatus.Rejected,
    });
  }

  async acceptOne(user: User, { id }: AcceptJoinApplicationArgs) {
    const application = await this.repo.findOneOrFail(id, {
      filters: [FilterName.CRUD],
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot accept resulted applications');

    application.assign({
      status: ApplicationStatus.Accepted,
    });

    const membership = this.membershipRepo.create({
      owner: application.owner,
      classroom: application.classroom,
      role: Role.Student,
    });

    return { application, membership };
  }
}
