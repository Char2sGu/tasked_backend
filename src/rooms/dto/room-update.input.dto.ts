import { InputType, PartialType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';

import { RoomCreateInput } from './room-create.input.dto';

@InputType()
export class RoomUpdateInput extends PartialType(RoomCreateInput) {
  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean;
}
