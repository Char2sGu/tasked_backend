import { NotFoundError } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Meets } from './meets.decorator';
import { ValidationArguments } from './validation-arguments.interface';

@ValidatorConstraint()
@Injectable()
export class MeetsConstraint implements ValidatorConstraintInterface {
  @Inject()
  moduleRef: ModuleRef;

  async validate(
    value: unknown,
    {
      object: {
        _context: { user },
        ...object
      },
      constraints: [type, serviceType, getConditions],
    }: ValidationArguments<Parameters<typeof Meets>>,
  ) {
    const resultIfExists = type == 'exists' ? true : false;
    const service = this.moduleRef.get(serviceType(), { strict: false });
    const conditions = getConditions(value, user, object);
    try {
      await service.retrieve({ conditions, user });
      return resultIfExists;
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error;
      return !resultIfExists;
    }
  }
}
