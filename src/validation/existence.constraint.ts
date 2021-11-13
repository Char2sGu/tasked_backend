import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CRUD_FILTER } from 'src/crud/crud-filter.constant';

import { Existence } from './existence.decorator';
import { ValidationArguments } from './validation-arguments.interface';
import { VALIDATION_CONTEXT } from './validation-context.symbol';

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
  private moduleRef: ModuleRef;

  async validate(
    value: unknown,
    {
      object: {
        [VALIDATION_CONTEXT]: { user },
        ...object
      },
      constraints: [shouldExist, serviceType, conditions],
    }: ValidationArguments<Parameters<typeof Existence>>,
  ) {
    const service = this.moduleRef.get(serviceType(), { strict: false });
    return (await service.crud.retrieve(
      conditions?.(value, user, object) ?? {},
      {
        filters: { [CRUD_FILTER]: { user } },
        failHandler: false,
      },
    ))
      ? shouldExist
      : !shouldExist;
  }
}
