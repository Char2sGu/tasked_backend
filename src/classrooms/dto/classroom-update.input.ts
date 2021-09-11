import { PartialType } from '@nestjs/mapped-types';

import { ClassroomCreateInput } from './classroom-create.input';

export class ClassroomUpdateInput extends PartialType(ClassroomCreateInput) {}
