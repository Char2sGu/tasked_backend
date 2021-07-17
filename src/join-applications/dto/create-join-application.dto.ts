import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { Role } from 'src/memberships/role.enum';
import { AsNonMember } from '../validators/as-non-member.validator';
import { NoPendingApplicaiton } from '../validators/no-pending-application.validator';

export class CreateJoinApplicationDto {
  @Validate(AsNonMember)
  @Validate(NoPendingApplicaiton)
  @IsInt()
  classroom: number;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @MaxLength(50)
  @IsString()
  message?: string;
}
