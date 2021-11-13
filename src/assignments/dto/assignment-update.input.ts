import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Field } from 'src/shared/field.decorator';
import { VALIDATION_CONTEXT } from 'src/validation/validation-context.symbol';

import { AssignmentCreateInput } from './assignment-create.input';

@InputType()
export class AssignmentUpdateInput extends PartialType(
  PickType(AssignmentCreateInput, [
    VALIDATION_CONTEXT,
    'isPublic',
    'isImportant',
  ] as const),
) {
  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;
}
