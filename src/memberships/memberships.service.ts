import { FilterQuery } from '@mikro-orm/core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/crud/crud.service';
import { CRUD_FILTER } from 'src/crud/crud-filter.constant';
import { User } from 'src/users/entities/user.entity';

import { DeleteMembershipArgs } from './dto/delete-membership.args';
import { QueryMembershipArgs } from './dto/query-membership.args';
import { QueryMembershipsArgs } from './dto/query-memberships.args';
import { UpdateMembershipArgs } from './dto/update-membership.args';
import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipsService {
  constructor(public crud: CrudService<Membership>) {}

  async queryMany(
    user: User,
    { limit, offset }: QueryMembershipsArgs,
    query: FilterQuery<Membership> = {},
  ) {
    return this.crud.list(query, {
      limit,
      offset,
      filters: { [CRUD_FILTER]: { user } },
    });
  }

  async queryOne(user: User, { id }: QueryMembershipArgs) {
    return this.crud.retrieve(id, { filters: { [CRUD_FILTER]: { user } } });
  }

  async updateOne(user: User, { id, data }: UpdateMembershipArgs) {
    const target = await this.crud.retrieve(id, {
      filters: { [CRUD_FILTER]: { user } },
    });
    const own = await this.crud.retrieve(
      { classroom: target.classroom, owner: user },
      { filters: { [CRUD_FILTER]: { user } } },
    );

    if (data.role != undefined) {
      if (target == own)
        throw new ForbiddenException(
          'Cannot update "role" of your own membership',
        );
      if ((await own.getWeight()) <= (await target.getWeight()))
        throw new ForbiddenException(
          'Cannot update "role" of memberships not inferior to you',
        );
    }

    return this.crud.update(target, data);
  }

  async deleteOne(user: User, { id }: DeleteMembershipArgs) {
    const targetMembership = await this.crud.retrieve(id, {
      filters: { [CRUD_FILTER]: { user } },
      populate: ['classroom'],
    });

    if (targetMembership.owner == targetMembership.classroom.creator)
      throw new ForbiddenException(
        'Cannot delete the membership of the creator',
      );

    if (
      targetMembership.classroom.creator != user &&
      targetMembership.owner != user
    ) {
      const ownMembership = await targetMembership.classroom.memberships
        .matching({
          where: { owner: user },
          filters: { [CRUD_FILTER]: { user } },
        })
        .then(([membership]) => membership);

      const ownWeight = await ownMembership.getWeight();
      const targetWeight = await targetMembership.getWeight();

      if (ownWeight <= targetWeight)
        throw new ForbiddenException(
          'Cannot delete memberships of superior members',
        );
    }

    return this.crud.destroy(targetMembership);
  }
}
