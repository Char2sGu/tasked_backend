import { Field, InputType, PartialType } from '@nestjs/graphql';

import { TaskCreateInput } from './task-create.input';

@InputType()
export class TaskUpdateInput extends PartialType(TaskCreateInput) {
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
