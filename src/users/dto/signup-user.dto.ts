import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  ValidateNested,
  IsArray,
  Length,
  MinLength,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PicturesType } from '@/utils/types/pictures.type';
export class SignupUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Length(0, 255)
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readonly civility: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Length(3, 60)
  readonly firstname: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Length(3, 60)
  readonly lastname: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly fonction: string;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => PicturesType)
  readonly avatar: PicturesType;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly ordersId: Array<string>;
}
