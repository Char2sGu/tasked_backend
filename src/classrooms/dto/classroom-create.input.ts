import { InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { Field } from 'src/common/field.decorator';

@InputType()
export class ClassroomCreateInput {
  @Field(() => String)
  @Length(1, 15)
  name: string;
}
