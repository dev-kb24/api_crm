import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsString()
  @IsOptional()
  readonly firstname: string;
  @IsString()
  @IsOptional()
  readonly lastname: string;
}
