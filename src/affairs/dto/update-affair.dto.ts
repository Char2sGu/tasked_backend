import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAffairDto } from './create-affair.dto';

export class UpdateAffairDto extends PartialType(
  OmitType(CreateAffairDto, ['classroom']),
) {}
