import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'src/common/validation/validation-arguments.interface';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';

import { AssignmentCreateInput } from './assignment-create.input';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsInferiorMemberConstraint
  implements ValidatorConstraintInterface
{
  @Inject()
  private service: MembershipsService;

  async validate(
    userId: number,
    {
      object: {
        _context: { user },
        classroom: classroomId,
      },
    }: ValidationArguments<[], AssignmentCreateInput>,
  ) {
    let ownMembership: Membership;
    let targetMembership: Membership;
    try {
      [ownMembership, targetMembership] = await Promise.all(
        ([user, userId] as const).map((owner) =>
          this.service.retrieve(
            { owner, classroom: classroomId },
            { filters: { visible: { user } } },
          ),
        ),
      );
    } catch {
      return false;
    }

    const [ownWeight, targetWeight] = [
      await ownMembership.getWeight(),
      await targetMembership.getWeight(),
    ];

    return ownWeight > targetWeight;
  }
}
