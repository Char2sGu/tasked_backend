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

import { AcceptApplicationArgs } from './dto/accept-application.args';
import { CreateApplicationArgs } from './dto/create-application.args';
import { DeleteApplicationArgs } from './dto/delete-application.args';
import { QueryApplicationArgs } from './dto/query-application.args';
import { QueryApplicationsArgs } from './dto/query-applications.args';
import { RejectApplicationArgs } from './dto/reject-application.args';
import { Application } from './entities/application.entity';
import { ApplicationStatus } from './entities/application-status.enum';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private repo: Repository<Application>,

    @InjectRepository(Membership)
    private membershipRepo: Repository<Membership>,

    @InjectRepository(Room)
    private roomRepo: Repository<Room>,

    private quota: MikroQuotaService,
  ) {}

  async queryMany(
    { limit, offset, isPending }: QueryApplicationsArgs,
    query: FilterQuery<Application> = {},
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

  async queryOne({ id }: QueryApplicationArgs) {
    return this.repo.findOneOrFail(id, { filters: [CommonFilter.Crud] });
  }

  async createOne({ data }: CreateApplicationArgs) {
    const user = Context.current.user;

    await this.roomRepo
      .findOne(data.room, {
        populate: ['memberships'],
        filters: false,
      })
      .then((room) => this.quota.check(room, 'memberships'));

    await this.roomRepo
      .findOne({
        id: data.room,
        $or: [
          {
            applications: {
              owner: user,
              status: ApplicationStatus.Pending,
            },
          },
          { memberships: { owner: user } },
        ],
      })
      .then((result) => {
        if (result)
          throw new BadRequestException(
            'room must be an ID of a room in which you have no membership or application',
          );
      });

    return this.repo.create({
      owner: user,
      status: ApplicationStatus.Pending,
      ...data,
    });
  }

  async rejectOne({ id }: RejectApplicationArgs) {
    const application = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
    });

    this.forbidResulted(application, 'reject');

    return application.assign({
      status: ApplicationStatus.Rejected,
    });
  }

  async acceptOne({ id }: AcceptApplicationArgs) {
    const application = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
    });

    this.forbidResulted(application, 'accept');

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

  async deleteOne({ id }: DeleteApplicationArgs) {
    const application = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
    });

    this.forbidResulted(application, 'delete');

    return this.repo.delete(application);
  }

  private forbidResulted(application: Application, action: string) {
    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException(`Cannot ${action} resulted applications`);
  }
}
