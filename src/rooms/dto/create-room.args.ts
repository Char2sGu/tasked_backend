import { ArgsType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';

import { RoomCreateInput } from './room-create.input';

@ArgsType()
export class CreateRoomArgs extends HasDataArgs.for(() => RoomCreateInput) {}
