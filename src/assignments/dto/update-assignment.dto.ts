import { PartialType, PickType } from '@nestjs/mapped-types';

import { CreateAssignmentDto } from './create-assignment.dto';

export class UpdateAssignmentDto extends PartialType(
  PickType(CreateAssignmentDto, ['_context', 'isPublic'] as const),
) {}
