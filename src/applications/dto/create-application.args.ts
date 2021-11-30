import { ArgsType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';

import { ApplicationCreateInput } from './application-create.input';

@ArgsType()
export class CreateApplicationArgs extends WithData.for(
  () => ApplicationCreateInput,
) {}
