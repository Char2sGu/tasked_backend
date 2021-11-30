import { ArgsType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';

import { AssignmentCreateInput } from './assignment-create.input';

@ArgsType()
export class CreateAssignmentArgs extends WithData.for(
  () => AssignmentCreateInput,
) {}
