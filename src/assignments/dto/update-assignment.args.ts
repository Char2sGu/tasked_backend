import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';
import { TargetedArgs } from 'src/common/dto/targeted.args';

import { AssignmentUpdateInput } from './assignment-update.input';

@ArgsType()
export class UpdateAssignmentArgs extends IntersectionType(
  TargetedArgs,
  HasDataArgs.for(() => AssignmentUpdateInput),
) {}
