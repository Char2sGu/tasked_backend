import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RefLoader } from 'src/common/ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationRefLoader extends RefLoader<Application> {
  constructor(
    @InjectRepository(Application) protected repo: Repository<Application>,
  ) {
    super();
  }
}
