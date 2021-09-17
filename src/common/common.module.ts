import { Global, Module } from '@nestjs/common';

import { crudFilters } from './crud-filters/crud-filters.provider';
import { CRUD_FILTERS } from './crud-filters/crud-filters.token';

@Global()
@Module({
  providers: [crudFilters],
  exports: [CRUD_FILTERS],
})
export class CommonModule {}
