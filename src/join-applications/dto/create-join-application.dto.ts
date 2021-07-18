import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AsNonMember } from 'src/constraints/as-non-member/as-non-member.decorator';
import { NoPendingApplication } from 'src/constraints/no-pending-application/no-pending-application.decorator';
import { Role } from 'src/memberships/role.enum';

export class CreateJoinApplicationDto {
  @NoPendingApplication()
  @AsNonMember()
  @IsInt()
  classroom: number;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @MaxLength(50)
  @IsString()
  message?: string;
}
