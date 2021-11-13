import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReqUser } from 'src/common/req-user.decorator';
import { FlushDbRequired } from 'src/shared/flush-db-required.decorator';
import { User } from 'src/users/entities/user.entity';

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
  async memberships(@Args() args: QueryMembershipsArgs, @ReqUser() user: User) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Membership)
  async membership(@Args() args: QueryMembershipArgs, @ReqUser() user: User) {
    return this.service.queryOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Membership)
  async updateMembership(
    @Args() args: UpdateMembershipArgs,
    @ReqUser() user: User,
  ) {
    return this.service.updateOne(user, args);
  }
  @FlushDbRequired()
  @Mutation(() => Membership)
  async deleteMembership(
    @Args() args: DeleteMembershipArgs,
    @ReqUser() user: User,
  ) {
    return this.service.deleteOne(user, args);
  }
}
