import { ArgsType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';

import { ApplicationCreateInput } from './application-create.input';

@ArgsType()
export class CreateApplicationArgs extends HasDataArgs.for(
  () => ApplicationCreateInput,
) {}
