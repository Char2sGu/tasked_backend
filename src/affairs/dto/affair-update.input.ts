import { InputType, OmitType, PartialType } from '@nestjs/graphql';

import { AffairCreateInput } from './affair-create.input';

@InputType()
export class AffairUpdateInput extends PartialType(
  OmitType(AffairCreateInput, ['classroom']),
) {}
