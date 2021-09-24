import { FindOptions } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';

/**
 * A function provider which will return a mikro-orm filter config to avoid
 * specifying filters repeatedly.
 */
export type CrudFilters = (user: User) => FindOptions<never>['filters'];
