import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { NotHasApplication } from 'src/constraints/not-has-application/not-has-application.decorator';
import { NotHasMember } from 'src/constraints/not-has-member/not-has-member.decorator';
import { Role } from 'src/memberships/role.enum';
import { ApplicationStatus } from '../application-status.enum';

export class CreateJoinApplicationDto {
  @NotHasApplication(ApplicationStatus.Pending)
  @NotHasMember()
  @IsInt()
  classroom: number;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @MaxLength(50)
  @IsString()
  message?: string;
}
