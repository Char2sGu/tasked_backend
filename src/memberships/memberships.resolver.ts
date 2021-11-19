import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { DeleteMembershipArgs } from './dto/delete-membership.args';
import { PaginatedMemberships } from './dto/paginated-memberships.dto';
import { QueryMembershipArgs } from './dto/query-membership.args';
import { QueryMembershipsArgs } from './dto/query-memberships.args';
import { UpdateMembershipArgs } from './dto/update-membership.args';
import { Membership } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';

@Resolver(() => Membership)
export class MembershipsResolver {
  constructor(private service: MembershipsService) {}

  @Query(() => PaginatedMemberships)
  async memberships(@Args() args: QueryMembershipsArgs) {
    return this.service.queryMany(args);
  }

  @Query(() => Membership)
  async membership(@Args() args: QueryMembershipArgs) {
    return this.service.queryOne(args);
  }

  @Mutation(() => Membership)
  async updateMembership(@Args() args: UpdateMembershipArgs) {
    return this.service.updateOne(args);
  }

  @Mutation(() => Membership)
  async deleteMembership(@Args() args: DeleteMembershipArgs) {
    return this.service.deleteOne(args);
  }
}
