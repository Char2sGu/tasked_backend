import { OmitType, PartialType } from '@nestjs/mapped-types';

import { AffairCreateInput } from './affair-create.input';

export class AffairUpdateInput extends PartialType(
  OmitType(AffairCreateInput, ['classroom']),
) {}
