import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MikroRefLoaderService } from 'src/mikro/mikro-ref-loader/mikro-ref-loader.service';

import { JoinApplication } from './entities/join-application.entity';

@Resolver(() => JoinApplication)
export class JoinApplicationsFieldsResolver {
  constructor(private loader: MikroRefLoaderService) {}

  @ResolveField()
  async owner(@Parent() entity: JoinApplication) {
    return this.loader.load(entity.owner);
  }

  @ResolveField()
  async room(@Parent() entity: JoinApplication) {
    return this.loader.load(entity.room);
  }
}
