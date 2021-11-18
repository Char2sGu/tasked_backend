import { AnyEntity, FindOptions } from '@mikro-orm/core';
import { Type } from '@nestjs/common';

import { QUOTA } from './quota.symbol';
import { QuotaMetadata } from './quota-metadata.interface';

export const Quota =
  (quota: number, filters?: FindOptions<never>['filters']) =>
  (type: Type<AnyEntity>) => {
    const metadata: QuotaMetadata = { quota, filters };
    Reflect.defineMetadata(QUOTA, metadata, type);
  };
