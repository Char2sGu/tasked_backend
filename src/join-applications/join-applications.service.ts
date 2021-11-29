import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Context } from 'src/context/context.class';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { MikroQuotaService } from 'src/mikro/mikro-quota/mikro-quota.service';
import { Repository } from 'src/mikro/repository.class';
import { Room } from 'src/rooms/entities/room.entity';

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

    @InjectRepository(Room)
    private roomRepo: Repository<Room>,

    private quota: MikroQuotaService,
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

    await this.roomRepo
      .findOne(
        {
          id: data.room,
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
            'room must be an ID of a room in which you have no membership or application',
          );
      });

    const room = await this.roomRepo.findOne(data.room, {
      populate: ['memberships'],
    });
    await this.quota.check(room, 'memberships');

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
      room: application.room,
      role: Role.Member,
    });

    return { application, membership };
  }
}
