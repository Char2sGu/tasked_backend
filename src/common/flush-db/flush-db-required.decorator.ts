import { SetMetadata } from '@nestjs/common';

import { FLUSH_DB_REQUIRED } from './flush-db-required.symbol';

/**
 * Mark a routing method as requiring flushing database after the method is
 * over.
 * @see {FlushDbInterceptor}
 * @returns
 */
export const FlushDbRequired = () => SetMetadata(FLUSH_DB_REQUIRED, true);
