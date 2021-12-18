import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRefLoader } from 'src/common/entity-ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Task } from './entities/task.entity';

@Injectable()
export class TaskRefLoader extends EntityRefLoader<Task> {
  constructor(@InjectRepository(Task) protected repo: Repository<Task>) {
    super();
  }
}
