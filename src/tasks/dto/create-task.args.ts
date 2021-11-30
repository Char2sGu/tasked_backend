import { ArgsType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';

import { TaskCreateInput } from './task-create.input';

@ArgsType()
export class CreateTaskArgs extends WithData.for(() => TaskCreateInput) {}
