import { ArgsType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';

import { RoomCreateInput } from './room-create.input';

@ArgsType()
export class CreateRoomArgs extends WithData.for(() => RoomCreateInput) {}
