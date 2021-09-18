import { ArgsType } from '@nestjs/graphql';
import { CreateOneArgs } from 'src/common/dto/create-one.args';

import { UserCreateInput } from './user-create.input';

@ArgsType()
export class CreateUserArgs extends CreateOneArgs.of(UserCreateInput) {}
