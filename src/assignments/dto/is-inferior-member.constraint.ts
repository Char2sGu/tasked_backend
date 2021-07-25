import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { ValidationArguments } from 'src/validation-arguments.interface';
import { CreateAssignmentDto } from './create-assignment.dto';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsInferiorMemberConstraint
  implements ValidatorConstraintInterface {
  @Inject()
  membershipsService: MembershipsService;

  async validate(
    userId: number,
    {
      object: {
        _context: { user },
        classroom: classroomId,
      },
    }: ValidationArguments<[], CreateAssignmentDto>,
  ) {
    let ownMembership: Membership;
    let targetMembership: Membership;
    try {
      [ownMembership, targetMembership] = [
        await this.membershipsService.retrieve({
          conditions: {
            owner: user,
            classroom: classroomId,
          },
          user,
        }),
        await this.membershipsService.retrieve({
          conditions: {
            owner: userId,
            classroom: classroomId,
          },
          user,
        }),
      ];
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
