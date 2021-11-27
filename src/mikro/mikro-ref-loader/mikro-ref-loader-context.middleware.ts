import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { MikroRefLoaderContext } from './mikro-ref-loader-context.class';

@Injectable()
export class MikroRefLoaderContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    new MikroRefLoaderContext().apply(next);
  }
}
