import { InputType } from '@nestjs/graphql';
import { Field } from 'src/common/utilities/field.decorator';

import { ApplicationStatus } from '../entities/application-status.enum';

@InputType()
export class JoinApplicationUpdateInput {
  @Field(() => ApplicationStatus, { nullable: true })
  status?: ApplicationStatus;
}
