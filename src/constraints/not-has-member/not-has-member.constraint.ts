import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HasMemberConstraint } from '../has-member/has-member.constraint';

@ValidatorConstraint({ async: true })
@Injectable()
export class NotHasMemberConstraint implements ValidatorConstraintInterface {
  @Inject()
  inverseConstraint: HasMemberConstraint;

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
