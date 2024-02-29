import { IsNotEmpty, IsString, IsOptional, IsEmail, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PicturesType } from '@/utils/types/pictures.type';
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
  @IsNumber()
  @IsOptional()
  readonly civility: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly firstname: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
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
  readonly ordersId: Array<string>;
}
