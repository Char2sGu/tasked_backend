import { InputType } from '@nestjs/graphql';
import { Length, NotContains } from 'class-validator';
import { Field } from 'src/common/field.decorator';

@InputType()
export class MembershipUpdateInput {
  @Field(() => String, { nullable: true })
  @NotContains(' ')
  @Length(1, 15)
  displayName?: string;
}
