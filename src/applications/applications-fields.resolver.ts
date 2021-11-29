import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MikroRefLoaderService } from 'src/mikro/mikro-ref-loader/mikro-ref-loader.service';

import { Application } from './entities/application.entity';

@Resolver(() => Application)
export class ApplicationsFieldsResolver {
  constructor(private loader: MikroRefLoaderService) {}

  @ResolveField()
  async owner(@Parent() entity: Application) {
    return this.loader.load(entity.owner);
  }

  @ResolveField()
  async room(@Parent() entity: Application) {
    return this.loader.load(entity.room);
  }
}
