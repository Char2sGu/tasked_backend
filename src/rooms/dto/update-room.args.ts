import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';
import { TargetedArgs } from 'src/common/dto/targeted.args';

import { RoomUpdateInput } from './room-update.input';

@ArgsType()
export class UpdateRoomArgs extends IntersectionType(
  TargetedArgs,
  HasDataArgs.for(() => RoomUpdateInput),
) {}
