import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { MikroBatchService } from 'src/mikro/mikro-batch/mikro-batch.service';

import { Membership } from './entities/membership.entity';

@Resolver(() => Membership)
export class MembershipsFieldsResolver {
  constructor(
    private batch: MikroBatchService,
    private assignmentsService: AssignmentsService,
  ) {}

  @ResolveField()
  async owner(@Parent() entity: Membership) {
    return this.batch.loadRef(entity.owner);
  }

  @ResolveField()
  async classroom(@Parent() entity: Membership) {
    return this.batch.loadRef(entity.classroom);
  }

  @ResolveField()
  async assignments(
    @Args() args: QueryAssignmentsArgs,
    @Parent() entity: Membership,
  ) {
    return this.assignmentsService.queryMany(args, { recipient: entity });
  }
}
