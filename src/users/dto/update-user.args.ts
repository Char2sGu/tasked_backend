import { ArgsType } from '@nestjs/graphql';
import { UpdateOneArgs } from 'src/common/dto/update-one.args';

import { UserUpdateInput } from './user-update.input';

@ArgsType()
export class UpdateUserArgs extends UpdateOneArgs.of(UserUpdateInput) {}
