import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Role } from 'src/memberships/role.enum';

export class CreateJoinApplicationDto {
  @IsInt()
  classroom: number;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @MaxLength(50)
  @IsString()
  message?: string;
}
