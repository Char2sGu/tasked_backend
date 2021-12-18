import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRefLoader } from 'src/common/entity-ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationRefLoader extends EntityRefLoader<Application> {
  constructor(
    @InjectRepository(Application) protected repo: Repository<Application>,
  ) {
    super();
  }
}
