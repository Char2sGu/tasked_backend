import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { MikroBatchContext } from './mikro-batch-context.class';

@Injectable()
export class MikroBatchContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    new MikroBatchContext().apply(next);
  }
}
