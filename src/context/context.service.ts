import { Injectable } from '@nestjs/common';

import { ContextInterceptor } from './context.interceptor';

@Injectable()
export class ContextService {
  get current() {
    return ContextInterceptor.storage.getStore();
  }
}
