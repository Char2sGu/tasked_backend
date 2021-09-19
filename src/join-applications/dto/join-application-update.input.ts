import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { IsIn, IsOptional } from 'class-validator';
import { Field } from 'src/common/field.decorator';

import { ApplicationStatus } from '../entities/application-status.enum';
import { JoinApplicationCreateInput } from './join-application-create.input';

@InputType()
export class JoinApplicationUpdateInput extends PartialType(
  PickType(JoinApplicationCreateInput, ['role'] as const),
) {
  @Field(() => ApplicationStatus, { nullable: true })
  @IsOptional()
  @IsIn([ApplicationStatus.Accepted, ApplicationStatus.Rejected])
  status?: ApplicationStatus;
}
