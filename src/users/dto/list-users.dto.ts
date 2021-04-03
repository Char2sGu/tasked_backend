import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ListUsersDto {
  @IsInt()
  @Type(() => Number)
  after: number;

  @IsInt()
  @Type(() => Number)
  limit: number;
}
