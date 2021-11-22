import { AnyEntity, Collection } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { MikroQuotaError } from './mikro-quota.error';
import { QUOTA } from './quota.symbol';

@Injectable()
export class MikroQuotaService {
  /**
   * Check whether the specified `Collection` field's quota is exceeded.
   *
   * The collection must be initialized first.
   *
   * @param entity
   */
  async check<Entity>(entity: Entity, field: CollectionField<Entity>) {
    const quota: number | undefined = Reflect.getMetadata(QUOTA, entity, field);
    if (quota == undefined) throw new Error('Quota not defined');

    const collection = entity[field] as unknown as Collection<AnyEntity>;
    if (!collection.isInitialized())
      throw new Error('Collection not initialized');

    const count = collection.count();
    if (count >= quota) throw new MikroQuotaError(entity, field, quota, count);
  }
}

type CollectionField<Entity> = {
  [Field in keyof Entity]: Entity[Field] extends Collection<any>
    ? Field
    : never;
}[Extract<keyof Entity, string>];
