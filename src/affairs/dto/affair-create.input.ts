import { InputType, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Field } from 'src/common/field.decorator';
import { Existence } from 'src/common/validation/existence.decorator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';

@InputType()
export class AffairCreateInput extends ValidationContextAttached {
  @Existence<Classroom>(true, () => ClassroomsService, () => ({}))
  @Field(() => Int)
  classroom: number;

  @Field(() => String)
  @Length(1, 50)
  title: string;

  @Field(() => Date)
  timeStart: Date;

  @Field(() => Date)
  timeEnd: Date;

  @Field(() => String, { nullable: true })
  @Length(1, 200)
  remark?: string;

  @Field(() => Boolean, { nullable: true })
  isActivated?: boolean;
}
