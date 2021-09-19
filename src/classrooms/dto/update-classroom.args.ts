import { ArgsType } from '@nestjs/graphql';
import { UpdateOneArgs } from 'src/common/dto/update-one.args';

import { ClassroomUpdateInput } from './classroom-update.input';

@ArgsType()
export class UpdateClassroomArgs extends UpdateOneArgs.of(
  ClassroomUpdateInput,
) {}
