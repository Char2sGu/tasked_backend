import { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CRUD_FILTER } from 'src/mikro/mikro-filters.constants';
import { Repository } from 'src/mikro/repository.class';
import { User } from 'src/users/entities/user.entity';

import { DeleteMembershipArgs } from './dto/delete-membership.args';
import { QueryMembershipArgs } from './dto/query-membership.args';
import { QueryMembershipsArgs } from './dto/query-memberships.args';
import { UpdateMembershipArgs } from './dto/update-membership.args';
import { Membership } from './entities/membership.entity';
import { Role } from './entities/role.enum';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership) private repo: Repository<Membership>,
  ) {}

  async queryMany(
    user: User,
    { limit, offset }: QueryMembershipsArgs,
    query: FilterQuery<Membership> = {},
  ) {
    return this.repo.findAndCount(query, {
      limit,
      offset,
      filters: [CRUD_FILTER],
    });
  }

  async queryOne(user: User, { id }: QueryMembershipArgs) {
    return this.repo.findOneOrFail(id, { filters: [CRUD_FILTER] });
  }

  async updateOne(user: User, { id, data }: UpdateMembershipArgs) {
    const [target] = await this.canWrite(user, id, 'update');
    return target.assign(data);
  }

  async deleteOne(user: User, { id }: DeleteMembershipArgs) {
    const [target] = await this.canWrite(user, id, 'delete');
    return this.repo.delete(target);
  }

  private async canWrite(
    user: User,
    where: FilterQuery<Membership>,
    action: string,
  ) {
    const targetMembership = await this.repo.findOneOrFail(where, {
      filters: [CRUD_FILTER],
    });
    const ownMembership = await this.repo.findOneOrFail({
      owner: user,
      classroom: targetMembership.classroom,
    });
    const classroom = await ownMembership.classroom.init();

    if (ownMembership.owner == classroom.creator) {
      if (ownMembership == targetMembership)
        throw new ForbiddenException(
          `Cannot ${action} the membership of the creator`,
        );
    } else if (ownMembership.role == Role.Teacher) {
      if (targetMembership.role != Role.Student)
        throw new ForbiddenException(
          `Cannot ${action} memberships of teachers`,
        );
    } else if (ownMembership.role == Role.Student) {
      if (ownMembership != targetMembership)
        throw new ForbiddenException(
          `Cannot ${action} memberships as a student`,
        );
    }

    return [targetMembership, ownMembership];
  }
}
