import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  readonly newPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;
}
