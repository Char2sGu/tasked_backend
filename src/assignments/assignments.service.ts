import { Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';

import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService extends new MikroCrudServiceFactory({
  entityClass: Assignment,
  dtoClasses: { create: CreateAssignmentDto, update: UpdateAssignmentDto },
}).product {}
