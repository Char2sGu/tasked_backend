import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Assignment } from './entities/assignment.entity';

@Resolver(() => Assignment)
export class AssignmentsFieldsResolver {
  @ResolveField()
  async recipient(@Parent() entity: Assignment) {
    return entity.recipient.init();
  }

  @ResolveField()
  async classroom(@Parent() entity: Assignment) {
    return entity.classroom.init();
  }

  @ResolveField()
  async task(@Parent() entity: Assignment) {
    return entity.task.init();
  }
}
