import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MembershipsService } from 'src/memberships/memberships.service';
import { ValidationArguments } from '../validation-arguments.interface';

type Constraints = [string | undefined];

@ValidatorConstraint({ async: true })
@Injectable()
export class HasMemberConstraint implements ValidatorConstraintInterface {
  @Inject()
  membershipsService: MembershipsService;

  async validate(
    classroomId: number,
    validationArguments: ValidationArguments<Constraints>,
  ) {
    const userId = this.getUserId(validationArguments);
    const { user } = validationArguments.object._context;
    try {
      await this.membershipsService.retrieve({
        conditions: { owner: userId, classroom: classroomId },
        user,
      });
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments<Constraints>) {
    const userId = this.getUserId(validationArguments);
    return `The classroom must have a member with user ID ${userId}`;
  }

  getUserId({
    object: {
      _context: { user },
      ...object
    },
    constraints: [userField],
  }: ValidationArguments<Constraints>) {
    return userField ? (object[userField] as number) : user.id;
  }
}
