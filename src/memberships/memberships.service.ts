import { FilterQuery } from '@mikro-orm/core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';
import { User } from 'src/users/entities/user.entity';

import { DeleteMembershipArgs } from './dto/delete-membership.args';
import { QueryMembershipArgs } from './dto/query-membership.args';
import { QueryMembershipsArgs } from './dto/query-memberships.args';
import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipsService extends CrudService.of(Membership) {
  async queryMany(
    user: User,
    { limit, offset }: QueryMembershipsArgs,
    query: FilterQuery<Membership> = {},
  ) {
    return this.list(query, { limit, offset, filters: { visible: { user } } });
  }

  async queryOne(user: User, { id }: QueryMembershipArgs) {
    return this.retrieve(id, { filters: { visible: { user } } });
  }

  async deleteOne(user: User, { id }: DeleteMembershipArgs) {
    const targetMembership = await this.retrieve(id, {
      filters: { visible: { user } },
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
          filters: { visible: { user } },
        })
        .then(([membership]) => membership);

      const ownWeight = await ownMembership.getWeight();
      const targetWeight = await targetMembership.getWeight();

      if (ownWeight <= targetWeight)
        throw new ForbiddenException(
          'Cannot delete memberships of superior members',
        );
    }

    return this.destroy(targetMembership);
  }
}
