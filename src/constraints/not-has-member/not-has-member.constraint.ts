import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HasMemberConstraint } from '../has-member/has-member.constraint';
import { ValidationArguments } from '../validation-arguments.interface';

type Constraints = [string | undefined];

@ValidatorConstraint({ async: true })
@Injectable()
export class NotHasMemberConstraint implements ValidatorConstraintInterface {
  @Inject()
  inverseConstraint: HasMemberConstraint;

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
