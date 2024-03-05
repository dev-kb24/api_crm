import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

export class Supplier_contactType {
  @ApiProperty()
  @IsBoolean()
  readonly principal_contact: boolean;

  @ApiProperty()
  @IsString()
  readonly firstname: string;

  @ApiProperty()
  @IsString()
  readonly lastname: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Length(10)
  readonly phone: string;

  @ApiProperty()
  @IsString()
  @Length(10)
  readonly mobile: string;

  @ApiProperty()
  @IsString()
  readonly fonction: string;
}
