import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { BodyContextAttached } from 'src/body-context-attached.dto';
import { Existence } from 'src/existence.decorator';
import { User } from '../entities/user.entity';
import { Gender } from '../gender.enum';
import { UsersService } from '../users.service';

export class CreateUserDto extends BodyContextAttached {
  @Existence<User>(
    false,
    () => UsersService,
    (username: string) => ({ username }),
  )
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
