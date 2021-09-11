import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class ClassroomCreateInput {
  @Field(() => String)
  @Length(1, 15)
  name: string;
}
