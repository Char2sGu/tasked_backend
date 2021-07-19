import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HasApplicationConstraint } from '../has-application/has-application.constraint';

@ValidatorConstraint({ async: true })
@Injectable()
export class NotHasApplicationConstraint
  implements ValidatorConstraintInterface {
  @Inject()
  inverseConstraint: HasApplicationConstraint;

  async validate(
    classroomId: number,
    validationArguments: ValidationArguments,
  ) {
    return !(await this.inverseConstraint.validate(
      classroomId,
      validationArguments,
    ));
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return this.inverseConstraint
      .defaultMessage(validationArguments)
      .replace('must', 'must not');
  }
}
