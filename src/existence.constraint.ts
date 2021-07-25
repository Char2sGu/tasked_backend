import { NotFoundError } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Existence } from './existence.decorator';
import { ValidationArguments } from './validation-arguments.interface';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistenceConstraint implements ValidatorConstraintInterface {
  @Inject()
  moduleRef: ModuleRef;

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
    try {
      await service.retrieve({ conditions, user });
      return shouldExist;
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error;
      return !shouldExist;
    }
  }
}