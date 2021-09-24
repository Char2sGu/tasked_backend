import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService extends CrudService.of(Assignment) {}
