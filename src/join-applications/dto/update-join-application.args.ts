import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';
import { TargetedArgs } from 'src/common/dto/targeted.args';

import { JoinApplicationUpdateInput } from './join-application-update.input';

@ArgsType()
export class UpdateJoinApplicationArgs extends IntersectionType(
  TargetedArgs,
  HasDataArgs.for(JoinApplicationUpdateInput),
) {}
