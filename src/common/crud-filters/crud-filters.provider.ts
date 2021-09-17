import { Provider } from '@nestjs/common';

import { CRUD_FILTERS } from './crud-filters.token';
import { CrudFilters } from './crud-filters.type';

export const crudFilters: Provider<CrudFilters> = {
  provide: CRUD_FILTERS,
  useValue: (user) => ({
    crud: { user },
  }),
};
