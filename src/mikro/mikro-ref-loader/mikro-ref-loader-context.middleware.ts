import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { DataLoaderModule } from 'src/data-loader/data-loader.module';

import { MikroRefLoaderContext } from './mikro-ref-loader-context.class';

/**
 * @deprecated
 * @see {DataLoaderModule}
 */
@Injectable()
export class MikroRefLoaderContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    new MikroRefLoaderContext().apply(next);
  }
}

DataLoaderModule;
