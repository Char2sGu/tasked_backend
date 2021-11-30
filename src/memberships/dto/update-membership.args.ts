import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';
import { WithId } from 'src/common/dto/with-id.args';

import { MembershipUpdateInput } from './membership-update.input';

@ArgsType()
export class UpdateMembershipArgs extends IntersectionType(
  WithId,
  WithData.for(() => MembershipUpdateInput),
) {}
