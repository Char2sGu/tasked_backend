import { IsString, Length } from 'class-validator';

export class ClassroomCreateInput {
  @Length(1, 15)
  @IsString()
  name: string;
}
