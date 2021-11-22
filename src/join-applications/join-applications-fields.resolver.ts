import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MikroBatchService } from 'src/mikro/mikro-batch/mikro-batch.service';

import { JoinApplication } from './entities/join-application.entity';

@Resolver(() => JoinApplication)
export class JoinApplicationsFieldsResolver {
  constructor(private batch: MikroBatchService) {}

  @ResolveField()
  async owner(@Parent() entity: JoinApplication) {
    return this.batch.load(entity.owner);
  }

  @ResolveField()
  async classroom(@Parent() entity: JoinApplication) {
    return this.batch.load(entity.classroom);
  }
}
