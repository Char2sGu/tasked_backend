import { AnyEntity, Collection } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { MikroQuotaError } from './mikro-quota.error';
import { QUOTA } from './quota.symbol';

@Injectable()
export class MikroQuotaService {
  /**
   * Check all *initialized* `Collection` fields defined its quota.
   * @param entity
   */
  async check(entity: AnyEntity) {
    Object.entries(entity).forEach(([field, value]) => {
      const quota: number | undefined = Reflect.getMetadata(
        QUOTA,
        entity,
        field,
      );

      if (quota == undefined) return;

      const collection = value as Collection<AnyEntity>;
      if (!collection.isInitialized()) return;

      const count = collection.count();
      if (count >= quota)
        throw new MikroQuotaError(entity, field, quota, count);
    });
  }
}
