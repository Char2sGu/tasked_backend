import { AnyEntity } from '@mikro-orm/core';
import { Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';

import { MikroQuotaError } from './mikro-quota.error';

@Catch(MikroQuotaError)
export class MikroQuotaFilter
  implements ExceptionFilter<MikroQuotaError<AnyEntity>>
{
  catch<Entity>(exception: MikroQuotaError<Entity>) {
    throw new ForbiddenException(
      `Cannot perform this operation because the quota is exceeded. (${exception.current}/${exception.quota})`,
    );
  }
}
