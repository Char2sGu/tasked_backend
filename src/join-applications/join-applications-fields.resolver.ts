import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { JoinApplication } from './entities/join-application.entity';

@Resolver(() => JoinApplication)
export class JoinApplicationsFieldsResolver {
  @ResolveField()
  async owner(@Parent() entity: JoinApplication) {
    return entity.owner.init();
  }

  @ResolveField()
  async classroom(@Parent() entity: JoinApplication) {
    return entity.classroom.init();
  }
}
