import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @Length(1, 30)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
