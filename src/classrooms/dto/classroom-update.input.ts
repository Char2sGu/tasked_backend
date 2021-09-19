import { InputType, PartialType } from '@nestjs/graphql';

import { ClassroomCreateInput } from './classroom-create.input';

@InputType()
export class ClassroomUpdateInput extends PartialType(ClassroomCreateInput) {}
