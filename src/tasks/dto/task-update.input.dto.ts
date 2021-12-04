import { Field, InputType, PartialType } from '@nestjs/graphql';

import { TaskCreateInput } from './task-create.input.dto';

@InputType()
export class TaskUpdateInput extends PartialType(TaskCreateInput) {
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
