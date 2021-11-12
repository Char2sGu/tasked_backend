import { InputType, PartialType } from '@nestjs/graphql';
import { Field } from 'src/shared/field.decorator';

import { ClassroomCreateInput } from './classroom-create.input';

@InputType()
export class ClassroomUpdateInput extends PartialType(ClassroomCreateInput) {
  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean;
}
