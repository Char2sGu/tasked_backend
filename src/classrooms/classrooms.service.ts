import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService extends CrudService.of(Classroom) {}
