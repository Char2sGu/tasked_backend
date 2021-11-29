import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Context } from 'src/context/context.class';
import { Repository } from 'src/mikro/repository.class';

import { DeleteMembershipArgs } from './dto/delete-membership.args';
import { QueryMembershipArgs } from './dto/query-membership.args';
import { QueryMembershipsArgs } from './dto/query-memberships.args';
import { UpdateMembershipArgs } from './dto/update-membership.args';
import { Membership } from './entities/membership.entity';
import { Role } from './entities/role.enum';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private repo: Repository<Membership>,
  ) {}

  async queryMany(
    { limit, offset }: QueryMembershipsArgs,
    query: FilterQuery<Membership> = {},
  ) {
    return this.repo.findAndPaginate(query, {
      limit,
      offset,
      filters: [CommonFilter.Crud],
    });
  }

  async queryOne({ id }: QueryMembershipArgs) {
    return this.repo.findOneOrFail(id, { filters: [CommonFilter.Crud] });
  }

  async updateOne({ id, data }: UpdateMembershipArgs) {
    const [target] = await this.canWrite(id, 'update');
    return target.assign(data);
  }

  async deleteOne({ id }: DeleteMembershipArgs) {
    const [target] = await this.canWrite(id, 'delete');
    await this.repo.populate(target, ['assignments']);
    return this.repo.delete(target);
  }

  private async canWrite(where: FilterQuery<Membership>, action: string) {
    const targetMembership = await this.repo.findOneOrFail(where, {
      filters: [CommonFilter.Crud],
    });
    const ownMembership = await this.repo.findOneOrFail({
      owner: Context.current.user,
      room: targetMembership.room,
    });
    const room = await ownMembership.room.init();

    if (ownMembership.owner == room.creator) {
      if (ownMembership == targetMembership)
        throw new ForbiddenException(
          `Cannot ${action} the membership of the creator`,
        );
    } else if (ownMembership.role == Role.Manager) {
      if (targetMembership.role != Role.Member)
        throw new ForbiddenException(
          `Cannot ${action} memberships of managers`,
        );
    } else if (ownMembership.role == Role.Member) {
      if (ownMembership != targetMembership)
        throw new ForbiddenException(
          `Cannot ${action} memberships as a member`,
        );
    }

    return [targetMembership, ownMembership];
  }
}
