import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';

import { Membership } from './entities/membership.entity';

@Resolver(() => Membership)
export class MembershipsFieldsResolver {
  constructor(private assignmentsService: AssignmentsService) {}

  @ResolveField()
  async owner(@Parent() entity: Membership) {
    return entity.owner.init();
  }

  @ResolveField()
  async classroom(@Parent() entity: Membership) {
    return entity.classroom.init();
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Membership,
  ) {
    return this.assignmentsService.queryMany(args, { recipient: entity });
  }
}
