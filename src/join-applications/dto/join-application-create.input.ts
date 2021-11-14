import { ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Field } from 'src/common/field.decorator';

@InputType()
export class JoinApplicationCreateInput {
  @Field(() => ID)
  classroom: number;

  @Field(() => String, { nullable: true })
  @MaxLength(20)
  message?: string;
}
