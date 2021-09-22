import { ArgsType } from '@nestjs/graphql';
import { UpdateOneArgs } from 'src/common/dto/update-one.args';

import { TaskUpdateInput } from './task-update.input';

@ArgsType()
export class UpdateTaskArgs extends UpdateOneArgs.of(TaskUpdateInput) {}
