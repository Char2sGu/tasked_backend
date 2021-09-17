import { FindOptions } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';

export type CrudFilters = (user?: User) => FindOptions<never>['filters'];
