import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Membership } from './entities/membership.entity';

@Resolver(() => Membership)
export class MembershipsFieldsResolver {
  @ResolveField()
  async owner(@Parent() entity: Membership) {
    return entity.owner.init();
  }

  @ResolveField()
  async classroom(@Parent() entity: Membership) {
    return entity.classroom.init();
  }
}
