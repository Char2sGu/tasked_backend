import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { JoinApplicationCreateInput } from './join-application-create.input';

@InputType()
export class JoinApplicationUpdateInput extends PartialType(
  PickType(JoinApplicationCreateInput, ['role'] as const),
) {}
