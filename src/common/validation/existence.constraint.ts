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

/**
 * A custom class-validator validation constraint to check whether the target
 * entity exists or not.
 *
 * @see {Existence}
 */
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
      constraints: [shouldExist, serviceType, conditions],
    }: ValidationArguments<Parameters<typeof Existence>>,
  ) {
    const service = this.moduleRef.get(serviceType(), { strict: false });
    return (await service.exists(conditions?.(value, user, object) ?? {}, {
      filters: this.filters(user),
    }))
      ? shouldExist
      : !shouldExist;
  }
}
