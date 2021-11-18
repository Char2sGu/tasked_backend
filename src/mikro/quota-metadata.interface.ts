import { FindOptions } from '@mikro-orm/core';

export interface QuotaMetadata {
  quota: number;
  filters?: FindOptions<never>['filters'];
}
