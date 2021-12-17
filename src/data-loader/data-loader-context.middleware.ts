import { Injectable, NestMiddleware } from '@nestjs/common';

import { DataLoaderContext } from './data-loader-context.class';

@Injectable()
export class DataLoaderContextMiddleware implements NestMiddleware {
  use(req: unknown, res: unknown, next: () => void) {
    new DataLoaderContext().apply(next);
  }
}
