import { FindOptions } from '@mikro-orm/core';

export type MikroFilterOptions = NonNullable<FindOptions<never>['filters']>;
