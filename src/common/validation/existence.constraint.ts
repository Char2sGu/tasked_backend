import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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
  private moduleRef: ModuleRef;

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
    return (await service.retrieve(conditions?.(value, user, object) ?? {}, {
      filters: { visible: { user } },
      failHandler: false,
    }))
      ? shouldExist
      : !shouldExist;
  }
}
