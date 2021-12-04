import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args.dto';
import { WithId } from 'src/common/dto/with-id.args.dto';

import { RoomUpdateInput } from './room-update.input.dto';

@ArgsType()
export class UpdateRoomArgs extends IntersectionType(
  WithId,
  WithData.for(() => RoomUpdateInput),
) {}
