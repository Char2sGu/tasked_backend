import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSheduleItemDto } from './create-shedule-item.dto';

export class UpdateSheduleItemDto extends PartialType(
  OmitType(CreateSheduleItemDto, ['classroom']),
) {}
