import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args.dto';
import { WithId } from 'src/common/dto/with-id.args.dto';

import { UserUpdateInput } from './user-update.input.dto';

@ArgsType()
export class UpdateUserArgs extends IntersectionType(
  WithId,
  WithData.for(() => UserUpdateInput),
) {}
