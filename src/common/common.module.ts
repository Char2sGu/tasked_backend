import { Global, Module } from '@nestjs/common';

import { crudFilters } from './crud-filters/crud-filters.provider';
import { CRUD_FILTERS } from './crud-filters/crud-filters.token';

/**
 * Provide common injections globally for every feature modules.
 */
@Global()
@Module({
  providers: [crudFilters],
  exports: [CRUD_FILTERS],
})
export class CommonModule {}
