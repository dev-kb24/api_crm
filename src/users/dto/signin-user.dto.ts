import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SigninUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Length(0, 255)
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
