import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';

import { ApplicationStatus } from '../application-status.enum';
import { JoinApplicationCreateInput } from './join-application-create.input';

export class JoinApplicationUpdateInput extends PartialType(
  PickType(JoinApplicationCreateInput, ['role'] as const),
) {
  @IsOptional()
  @IsIn([ApplicationStatus.Accepted, ApplicationStatus.Rejected])
  status?: ApplicationStatus;
}
