import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { MikroFlushContext } from './mikro-flush-context.class';

@Injectable()
export class MikroFlushContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    new MikroFlushContext().apply(next);
  }
}
