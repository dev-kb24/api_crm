import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;
}
