import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Gender } from '../gender.enum';

export class CreateUserDto {
  @Matches(/^([a-zA-Z0-9_-])+$/)
  @Length(1, 15)
  @IsString()
  username: string;

  @IsOptional()
  @Length(1, 15)
  @IsString()
  nickname?: string;

  @Length(6, 20)
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
