import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HasApplicationConstraint } from '../has-application/has-application.constraint';
import { ValidationArguments } from '../validation-arguments.interface';
import { NotHasApplicationConstraintArguments } from './not-has-application-constraint-arguments.type';

@ValidatorConstraint({ async: true })
@Injectable()
export class NotHasApplicationConstraint
  implements ValidatorConstraintInterface {
  @Inject()
  inverseConstraint: HasApplicationConstraint;

  async validate(
    classroomId: number,
    validationArguments: ValidationArguments<NotHasApplicationConstraintArguments>,
  ) {
    return !(await this.inverseConstraint.validate(
      classroomId,
      validationArguments,
    ));
  }

  defaultMessage(
    validationArguments: ValidationArguments<NotHasApplicationConstraintArguments>,
  ) {
    return this.inverseConstraint
      .defaultMessage(validationArguments)
      .replace('must', 'must not');
  }
}
