import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApplicationStatus } from 'src/join-applications/application-status.enum';
import { HasApplicationConstraint } from '../has-application/has-application.constraint';
import { ValidationArguments } from '../validation-arguments.interface';

type Constraints = [ApplicationStatus | undefined];

@ValidatorConstraint({ async: true })
@Injectable()
export class NotHasApplicationConstraint
  implements ValidatorConstraintInterface {
  @Inject()
  inverseConstraint: HasApplicationConstraint;

  async validate(
    classroomId: number,
    validationArguments: ValidationArguments<Constraints>,
  ) {
    return !(await this.inverseConstraint.validate(
      classroomId,
      validationArguments,
    ));
  }

  defaultMessage(validationArguments: ValidationArguments<Constraints>) {
    return this.inverseConstraint
      .defaultMessage(validationArguments)
      .replace('must', 'must not');
  }
}
