import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Context } from 'src/context/context.class';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { QuotaService } from 'src/mikro/quota.service';
import { Repository } from 'src/mikro/repository.class';

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

    private quotaService: QuotaService,
  ) {}

  async queryMany(
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
        filters: [CommonFilter.Crud],
        orderBy: { id: QueryOrder.DESC },
      },
    );
  }

  async queryOne({ id }: QueryJoinApplicationArgs) {
    return this.repo.findOneOrFail(id, { filters: [CommonFilter.Crud] });
  }

  async createOne({ data }: CreateJoinApplicationArgs) {
    const user = Context.current.user;

    await this.classroomRepo
      .findOne(
        {
          id: data.classroom,
          $or: [
            {
              joinApplications: {
                owner: user,
                status: ApplicationStatus.Pending,
              },
            },
            { memberships: { owner: user } },
          ],
        },
        { filters: [CommonFilter.Crud] },
      )
      .then((result) => {
        if (result)
          throw new BadRequestException(
            'classroom must be an ID of a classroom in which you have no membership or application',
          );
      });

    const classroom = await this.classroomRepo.findOne(data.classroom, {
      populate: ['memberships'],
    });
    await this.quotaService.check(classroom);

    return this.repo.create({
      owner: user,
      status: ApplicationStatus.Pending,
      ...data,
    });
  }

  async rejectOne({ id }: RejectJoinApplicationArgs) {
    const application = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot reject resulted applications');

    return application.assign({
      status: ApplicationStatus.Rejected,
    });
  }

  async acceptOne({ id }: AcceptJoinApplicationArgs) {
    const application = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
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
