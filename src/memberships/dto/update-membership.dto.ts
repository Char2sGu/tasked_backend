import { IsString, Length, NotContains } from 'class-validator';

export class UpdateMembershipDto {
  @NotContains(' ')
  @Length(1, 15)
  @IsString()
  displayName?: string;
}
