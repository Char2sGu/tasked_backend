import { PartialType } from '@nestjs/graphql';

import { ClassroomCreateInput } from './classroom-create.input';

export class ClassroomUpdateInput extends PartialType(ClassroomCreateInput) {}
