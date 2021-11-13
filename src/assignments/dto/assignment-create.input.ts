import { ID, InputType } from '@nestjs/graphql';
import { Field } from 'src/shared/field.decorator';
import { ValidationContextAttached } from 'src/validation/validation-context-attached.dto';

@InputType()
export class AssignmentCreateInput extends ValidationContextAttached {
  @Field(() => ID)
  recipient: number;

  @Field(() => ID)
  task: number;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}
