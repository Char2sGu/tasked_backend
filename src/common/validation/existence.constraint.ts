import { NotFoundError } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { CrudService } from '../crud.service';
import { CRUD_FILTERS } from '../crud-filters.token';
import { CrudFilters } from '../crud-filters.type';
import { Existence } from './existence.decorator';
import { ValidationArguments } from './validation-arguments.interface';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistenceConstraint implements ValidatorConstraintInterface {
  @Inject()
  moduleRef: ModuleRef;

  @Inject(CRUD_FILTERS)
  filters: CrudFilters;

  async validate(
    value: unknown,
    {
      object: {
        _context: { user },
        ...object
      },
      constraints: [shouldExist, serviceType, getConditions],
    }: ValidationArguments<Parameters<typeof Existence>>,
  ) {
    const service = this.moduleRef.get(serviceType(), { strict: false });
    const conditions = getConditions(value, user, object);

    if (service instanceof CrudService)
      return await service.exists(conditions, { filters: this.filters(user) });

    // TODO: deprecate nest-mikro-crud
    try {
      await service.retrieve({ conditions, user });
      return shouldExist;
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error;
      return !shouldExist;
    }
  }
}
