import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SignupUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly firstname: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly lastname: string;
}
