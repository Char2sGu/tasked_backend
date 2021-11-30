import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';
import { WithId } from 'src/common/dto/with-id.args';

import { RoomUpdateInput } from './room-update.input';

@ArgsType()
export class UpdateRoomArgs extends IntersectionType(
  WithId,
  WithData.for(() => RoomUpdateInput),
) {}
