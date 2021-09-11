import { Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';

import { AssignmentCreateInput } from './dto/assignment-create.input';
import { AssignmentUpdateInput } from './dto/assignment-update.input';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService extends new MikroCrudServiceFactory({
  entityClass: Assignment,
  dtoClasses: { create: AssignmentCreateInput, update: AssignmentUpdateInput },
}).product {}
