import { Global, Module } from '@nestjs/common';

import { CRUD_FILTERS } from './crud-filters.token';
import { CrudFilters } from './crud-filters.type';

@Global()
@Module({
  providers: [
    {
      provide: CRUD_FILTERS,
      useValue: ((user) => ({ crud: { user } })) as CrudFilters,
    },
  ],
  exports: [CRUD_FILTERS],
})
export class CommonModule {}
