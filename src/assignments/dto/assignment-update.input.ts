import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';

import { AssignmentCreateInput } from './assignment-create.input';

@InputType()
export class AssignmentUpdateInput extends PartialType(
  PickType(AssignmentCreateInput, ['isPublic', 'isImportant'] as const),
) {
  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;
}
