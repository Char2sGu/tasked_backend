import { SetMetadata } from '@nestjs/common';

import { FLUSH_DB } from './flush-db.symbol';

/**
 * Mark a routing method as requiring flushing database after the method is
 * over.
 * @see {FlushDbInterceptor}
 * @returns
 */
export const FlushDb = () => SetMetadata(FLUSH_DB, true);
