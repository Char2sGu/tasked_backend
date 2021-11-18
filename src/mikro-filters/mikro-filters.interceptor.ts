import { EntityManager } from '@mikro-orm/knex';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { Observable } from 'rxjs';

import { CRUD_FILTER } from './crud-filter.constant';
import { QUOTA_FILTER } from './quota-filter.constant';

@Injectable()
export class MikroFiltersInterceptor implements NestInterceptor {
  constructor(private em: EntityManager) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request =
      GqlExecutionContext.create(context).getContext<ExpressContext>().req;

    if (request.user) {
      this.em.setFilterParams(CRUD_FILTER, { user: request.user });
      this.em.setFilterParams(QUOTA_FILTER, { user: request.user });
    }

    return next.handle();
  }
}
