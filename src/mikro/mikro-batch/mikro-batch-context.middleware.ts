import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response } from 'express';

import { BaseEntity } from '../base-entity.entity';
import { MikroBatchDataLoader } from './mikro-batch-data-loader.type';

@Injectable()
export class MikroBatchContextMiddleware implements NestMiddleware {
  static get current() {
    return this.storage.getStore();
  }
  private static storage = new AsyncLocalStorage<LoaderMap>();

  use(req: Request, res: Response, next: () => void) {
    MikroBatchContextMiddleware.storage.run({}, next);
  }
}

interface LoaderMap {
  [typeName: string]: MikroBatchDataLoader<BaseEntity<any>>;
}
