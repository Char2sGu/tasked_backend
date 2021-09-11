import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class AffairCreateInput {
  @IsInt()
  classroom: number;

  @IsString()
  @Length(1, 50)
  title: string;

  @Type(() => Date)
  @IsDate()
  timeStart: Date;

  @Type(() => Date)
  @IsDate()
  timeEnd: Date;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  remark?: string;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;
}
