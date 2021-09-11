import { PartialType } from '@nestjs/mapped-types';

import { UserCreateInput } from './user-create.input';

export class UserUpdateInput extends PartialType(UserCreateInput) {}
