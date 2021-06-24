import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateScheduleItemDto } from './create-schedule-item.dto';

export class UpdateScheduleItemDto extends PartialType(
  OmitType(CreateScheduleItemDto, ['classroom']),
) {}
