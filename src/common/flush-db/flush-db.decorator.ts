import { SetMetadata } from '@nestjs/common';

import { FLUSH_DB } from './flush-db.symbol';

export const FlushDb = () => SetMetadata(FLUSH_DB, true);
