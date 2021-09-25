import { ArgsType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';

import { UserCreateInput } from './user-create.input';

@ArgsType()
export class CreateUserArgs extends HasDataArgs.for(() => UserCreateInput) {}
