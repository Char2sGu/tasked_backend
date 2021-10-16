import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
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
  private service: MembershipsService;

  @Query(() => PaginatedMemberships, {
    name: 'memberships',
  })
  async queryMany(@ReqUser() user: User, @Args() args: QueryMembershipsArgs) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Membership, {
    name: 'membership',
  })
  async queryOne(@ReqUser() user: User, @Args() args: QueryMembershipArgs) {
    return this.service.queryOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Membership, {
    name: 'deleteMembership',
  })
  async deleteOne(@ReqUser() user: User, @Args() args: DeleteMembershipArgs) {
    return this.service.deleteOne(user, args);
  }

  @ResolveField(() => Membership, 'owner', () => User)
  resolveOwner(@Parent() entity: Membership) {
    return entity.owner.init();
  }

  @ResolveField(() => Membership, 'classroom', () => Classroom)
  resolveClassroom(@Parent() entity: Membership) {
    return entity.classroom.init();
  }
}
