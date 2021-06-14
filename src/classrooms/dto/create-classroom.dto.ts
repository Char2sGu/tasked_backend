import { IsString, Length } from 'class-validator';

export class CreateClassroomDto {
  @Length(1, 15)
  @IsString()
  name: string;
}
