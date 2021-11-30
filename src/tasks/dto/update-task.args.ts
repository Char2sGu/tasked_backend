import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';
import { WithId } from 'src/common/dto/with-id.args';

import { TaskUpdateInput } from './task-update.input';

@ArgsType()
export class UpdateTaskArgs extends IntersectionType(
  WithId,
  WithData.for(() => TaskUpdateInput),
) {}
