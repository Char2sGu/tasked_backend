import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { Task } from './entities/task.entity';

@Injectable()
export class TasksService extends CrudService.of(Task) {}
