import { ArgsType } from '@nestjs/graphql';
import { CreateOneArgs } from 'src/common/dto/create-one.args';

import { ClassroomCreateInput } from './classroom-create.input';

@ArgsType()
export class CreateClassroomArgs extends CreateOneArgs.of(
  ClassroomCreateInput,
) {}
