import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { CRUD_FILTERS } from '../crud-filters/crud-filters.token';
import { CrudFilters } from '../crud-filters/crud-filters.type';
import { Existence } from './existence.decorator';
import { ValidationArguments } from './validation-arguments.interface';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistenceConstraint implements ValidatorConstraintInterface {
  @Inject()
  private readonly moduleRef: ModuleRef;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

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

    return (await service.exists(conditions, { filters: this.filters(user) }))
      ? shouldExist
      : !shouldExist;
  }
}
