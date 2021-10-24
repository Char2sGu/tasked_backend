import { InputType } from '@nestjs/graphql';
import { Length, NotContains } from 'class-validator';
import { Field } from 'src/common/utilities/field.decorator';

import { Role } from '../entities/role.enum';

@InputType()
export class MembershipUpdateInput {
  @Field(() => String, { nullable: true })
  @NotContains(' ')
  @Length(1, 15)
  displayName?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
