import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MikroBatchService } from 'src/mikro/mikro-batch/mikro-batch.service';

import { Assignment } from './entities/assignment.entity';

@Resolver(() => Assignment)
export class AssignmentsFieldsResolver {
  constructor(private batch: MikroBatchService) {}

  @ResolveField()
  async recipient(@Parent() entity: Assignment) {
    return this.batch.load(entity.recipient);
  }

  @ResolveField()
  async task(@Parent() entity: Assignment) {
    return this.batch.load(entity.task);
  }
}
