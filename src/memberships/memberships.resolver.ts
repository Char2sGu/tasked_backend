import { ForbiddenException, Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { User } from 'src/users/entities/user.entity';

import { DeleteMembershipArgs } from './dto/delete-membership.args';
import { PaginatedMemberships } from './dto/paginated-memberships.dto';
import { QueryMembershipArgs } from './dto/query-membership.args';
import { QueryMembershipsArgs } from './dto/query-memberships.args';
import { Membership } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';

@Resolver(() => Membership)
export class MembershipsResolver {
  @Inject()
  private readonly service: MembershipsService;

  @Query(() => PaginatedMemberships, {
    name: 'memberships',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryMembershipsArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @Query(() => Membership, {
    name: 'membership',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryMembershipArgs) {
    return this.service.retrieve(id, { filters: { visible: { user } } });
  }

  @FlushDb()
  @Mutation(() => Membership, {
    name: 'deleteMembership',
  })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteMembershipArgs) {
    const targetMembership = await this.service.retrieve(id, {
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

    return this.service.destroy(id, { filters: { visible: { user } } });
  }

  @ResolveField(() => Membership, 'owner')
  resolveOwner(@Parent() entity: Membership) {
    return entity.owner.init();
  }

  @ResolveField(() => Membership, 'classroom')
  resolveClassroom(@Parent() entity: Membership) {
    return entity.classroom.init();
  }
}
