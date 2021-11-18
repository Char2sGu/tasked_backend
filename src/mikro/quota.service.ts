import { AnyEntity, EntityManager } from '@mikro-orm/core';
import { ForbiddenException, Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { QUOTA } from './quota.symbol';
import { QuotaMetadata } from './quota-metadata.interface';

@Injectable()
export class QuotaService {
  constructor(private reflector: Reflector, private em: EntityManager) {}

  async check(type: Type<AnyEntity>) {
    const metadata: QuotaMetadata | undefined = this.reflector.get(QUOTA, type);
    if (!metadata)
      throw new Error(
        `Cannot check the quota of ${type.name} entities for it is not defined`,
      );

    const count = await this.em.count(type, {}, { filters: metadata.filters });
    if (count >= metadata.quota)
      throw new ForbiddenException(
        `Cannot perform this operation because the quota is exceeded. (${count}/${metadata.quota})`,
      );
  }
}
