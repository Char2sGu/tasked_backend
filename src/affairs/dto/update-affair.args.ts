import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';
import { TargetedArgs } from 'src/common/dto/targeted.args';

import { AffairCreateInput } from './affair-create.input';

@ArgsType()
export class UpdateAffairArgs extends IntersectionType(
  TargetedArgs,
  HasDataArgs.for(AffairCreateInput),
) {}
