import { ArgsType } from '@nestjs/graphql';
import { CreateOneArgs } from 'src/common/dto/create-one.args';

import { TaskCreateInput } from './task-create.input';

@ArgsType()
export class CreateTaskArgs extends CreateOneArgs.of(TaskCreateInput) {}
