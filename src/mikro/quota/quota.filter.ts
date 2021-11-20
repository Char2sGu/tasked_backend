import { AnyEntity } from '@mikro-orm/core';
import { Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';

import { QuotaError } from './quota.error';

@Catch(QuotaError)
export class QuotaFilter implements ExceptionFilter<QuotaError<AnyEntity>> {
  catch<Entity>(exception: QuotaError<Entity>) {
    throw new ForbiddenException(
      `Cannot perform this operation because the quota is exceeded. (${exception.current}/${exception.quota})`,
    );
  }
}
