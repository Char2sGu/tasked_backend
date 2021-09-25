import { ArgsType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';

import { TaskCreateInput } from './task-create.input';

@ArgsType()
export class CreateTaskArgs extends HasDataArgs.for(() => TaskCreateInput) {}
