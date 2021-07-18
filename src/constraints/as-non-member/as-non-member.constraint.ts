import { Inject } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BodyContextAttached } from 'src/body-context/body-context-attached.interface';
import { MembershipsService } from 'src/memberships/memberships.service';

@ValidatorConstraint({ async: true })
export class AsNonMemberConstraint implements ValidatorConstraintInterface {
  @Inject()
  membershipsService: MembershipsService;

  async validate(
    classroomId: number,
    {
      object: {
        _context: { user },
      },
    }: ValidationArguments & { object: BodyContextAttached },
  ) {
    try {
      await this.membershipsService.retrieve({
        conditions: { owner: user, classroom: classroomId },
        user,
      });
      return false;
    } catch {
      return true;
    }
  }

  defaultMessage() {
    return 'Already a member of this classroom';
  }
}
