import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';
import { WithId } from 'src/common/dto/with-id.args';

import { AssignmentUpdateInput } from './assignment-update.input';

@ArgsType()
export class UpdateAssignmentArgs extends IntersectionType(
  WithId,
  WithData.for(() => AssignmentUpdateInput),
) {}
