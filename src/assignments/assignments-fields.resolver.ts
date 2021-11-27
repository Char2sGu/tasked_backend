import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MikroRefLoaderService } from 'src/mikro/mikro-ref-loader/mikro-ref-loader.service';

import { Assignment } from './entities/assignment.entity';

@Resolver(() => Assignment)
export class AssignmentsFieldsResolver {
  constructor(private loader: MikroRefLoaderService) {}

  @ResolveField()
  async recipient(@Parent() entity: Assignment) {
    return this.loader.load(entity.recipient);
  }

  @ResolveField()
  async task(@Parent() entity: Assignment) {
    return this.loader.load(entity.task);
  }
}
