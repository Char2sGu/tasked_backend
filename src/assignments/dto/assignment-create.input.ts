import { ID, InputType } from '@nestjs/graphql';
import { Field } from 'src/shared/field.decorator';

@InputType()
export class AssignmentCreateInput {
  @Field(() => ID)
  recipient: number;

  @Field(() => ID)
  task: number;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}
