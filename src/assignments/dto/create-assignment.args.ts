import { ArgsType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';

import { AssignmentCreateInput } from './assignment-create.input';

@ArgsType()
export class CreateAssignmentArgs extends HasDataArgs.for(
  AssignmentCreateInput,
) {}
