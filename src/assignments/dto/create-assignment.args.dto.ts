import { ArgsType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args.dto';

import { AssignmentCreateInput } from './assignment-create.input.dto';

@ArgsType()
export class CreateAssignmentArgs extends WithData.for(
  () => AssignmentCreateInput,
) {}
