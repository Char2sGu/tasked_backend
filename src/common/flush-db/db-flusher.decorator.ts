import { SetMetadata, Type } from '@nestjs/common';

import { DB_FLUSHER } from './db-flusher.symbol';

export const DbFlusher = (flusherToken: string | symbol | Type) =>
  SetMetadata(DB_FLUSHER, flusherToken);
