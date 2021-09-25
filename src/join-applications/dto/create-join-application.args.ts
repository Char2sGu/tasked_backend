import { ArgsType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';

import { JoinApplicationCreateInput } from './join-application-create.input';

@ArgsType()
export class CreateJoinApplicationArgs extends HasDataArgs.for(
  () => JoinApplicationCreateInput,
) {}
