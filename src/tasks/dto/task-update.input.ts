import { PartialType } from '@nestjs/mapped-types';

import { TaskCreateInput } from './task-create.input';

export class TaskUpdateInput extends PartialType(TaskCreateInput) {}
