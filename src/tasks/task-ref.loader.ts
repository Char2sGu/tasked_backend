import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RefLoader } from 'src/common/ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Task } from './entities/task.entity';

@Injectable()
export class TaskRefLoader extends RefLoader<Task> {
  constructor(@InjectRepository(Task) protected repo: Repository<Task>) {
    super();
  }
}
