import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';
import { TargetedArgs } from 'src/common/dto/targeted.args';

import { MembershipUpdateInput } from './membership-update.input';

@ArgsType()
export class UpdateMembershipArgs extends IntersectionType(
  TargetedArgs,
  HasDataArgs.for(() => MembershipUpdateInput),
) {}
