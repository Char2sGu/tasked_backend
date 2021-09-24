import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { AssignmentCreateInput } from './assignment-create.input';

@InputType()
export class AssignmentUpdateInput extends PartialType(
  PickType(AssignmentCreateInput, ['_context', 'isPublic'] as const),
) {}
