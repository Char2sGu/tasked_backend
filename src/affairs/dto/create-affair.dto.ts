import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAffairDto {
  @IsInt()
  classroom: number;

  @IsString()
  @Length(1, 50)
  title: string;

  @Type(() => Date)
  @IsDate()
  time: Date;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  remark?: string;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;
}
