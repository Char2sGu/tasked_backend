import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BodyContextAttached } from 'src/body-context/body-context-attached.interface';
import { MembershipsService } from 'src/memberships/memberships.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class HasMemberConstraint implements ValidatorConstraintInterface {
  @Inject()
  membershipsService: MembershipsService;

  async validate(
    classroomId: number,
    validationArguments: ValidationArguments & { object: BodyContextAttached },
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

  defaultMessage(validationArguments: ValidationArguments) {
    const userId = this.getUserId(validationArguments);
    return `The classroom must have a member with user ID ${userId}`;
  }

  getUserId({
    object: {
      _context: { user },
      ...object
    },
    constraints,
  }: ValidationArguments & { object: BodyContextAttached }): number {
    const [userField] = constraints as [string | undefined];
    return userField ? object[userField] : user.id;
  }
}
