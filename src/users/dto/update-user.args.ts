import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';
import { WithId } from 'src/common/dto/with-id.args';

import { UserUpdateInput } from './user-update.input';

@ArgsType()
export class UpdateUserArgs extends IntersectionType(
  WithId,
  WithData.for(() => UserUpdateInput),
) {}
