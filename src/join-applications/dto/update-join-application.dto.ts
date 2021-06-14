import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../application-status.enum';
import { CreateJoinApplicationDto } from './create-join-application.dto';

export class UpdateJoinApplicationDto extends PartialType(
  PickType(CreateJoinApplicationDto, ['role'] as const),
) {
  @IsOptional()
  @IsIn([ApplicationStatus.Accepted, ApplicationStatus.Rejected])
  status?: ApplicationStatus;
}
