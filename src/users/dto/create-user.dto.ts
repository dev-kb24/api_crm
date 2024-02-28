import { PicturesType } from '@/utils/types/pictures.type';
import { Pictures } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNumber()
  @IsOptional()
  readonly civility: number;

  @IsString()
  @IsOptional()
  readonly firstname: string;

  @IsString()
  @IsOptional()
  readonly lastname: string;

  @IsString()
  @IsOptional()
  readonly fonction: string;

  @ValidateNested()
  @Type(() => PicturesType)
  readonly avatar: Pictures;

  @IsArray()
  @IsOptional()
  readonly ordersId: string[];
}
