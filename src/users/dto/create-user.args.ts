import { ArgsType } from '@nestjs/graphql';
import { WithData } from 'src/common/dto/with-data.args';

import { UserCreateInput } from './user-create.input';

@ArgsType()
export class CreateUserArgs extends WithData.for(() => UserCreateInput) {}
