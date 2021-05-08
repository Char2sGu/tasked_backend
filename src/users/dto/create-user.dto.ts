import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  NotContains,
} from 'class-validator';
import { Gender } from '../gender.enum';

export class CreateUserDto {
  @NotContains(' ')
  @Length(1, 15)
  @IsString()
  username: string;

  @Length(6, 20)
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
