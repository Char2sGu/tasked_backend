import { ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Room } from 'src/rooms/entities/room.entity';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class ApplicationCreateInput {
  @Field(() => ID)
  @IsPrimaryKey(() => Room, [CommonFilter.Crud])
  room: number;

  @Field(() => String, { nullable: true })
  @MaxLength(20)
  message?: string;
}
