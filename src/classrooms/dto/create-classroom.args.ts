import { ArgsType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';

import { ClassroomCreateInput } from './classroom-create.input';

@ArgsType()
export class CreateClassroomArgs extends HasDataArgs.for(
  () => ClassroomCreateInput,
) {}
