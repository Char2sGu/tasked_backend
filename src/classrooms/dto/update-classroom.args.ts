import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';
import { TargetedArgs } from 'src/common/dto/targeted.args';

import { ClassroomUpdateInput } from './classroom-update.input';

@ArgsType()
export class UpdateClassroomArgs extends IntersectionType(
  TargetedArgs,
  HasDataArgs.for(() => ClassroomUpdateInput),
) {}
