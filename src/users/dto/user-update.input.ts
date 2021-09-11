import { InputType, PartialType } from '@nestjs/graphql';

import { UserCreateInput } from './user-create.input';

@InputType()
export class UserUpdateInput extends PartialType(UserCreateInput) {}
