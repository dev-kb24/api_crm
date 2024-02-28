import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { AddressType } from '@/utils/types/address.type';
import { Address, Pictures } from '@prisma/client';
import { Type } from 'class-transformer';
import { PicturesType } from '@/utils/types/pictures.type';
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly comment: string;

  @ValidateNested()
  @Type(() => AddressType)
  readonly address: Address;

  @IsDateString()
  @IsOptional()
  readonly started_at: string;

  @IsDateString()
  @IsOptional()
  readonly finished_at: string;

  @IsString()
  @IsNotEmpty()
  readonly authorId: string;

  @IsArray()
  @IsNotEmpty()
  readonly usersId: string[];

  @IsArray()
  @IsNotEmpty()
  readonly productsId: string[];

  @ValidateNested({ each: true })
  @Type(() => PicturesType)
  readonly picture_before: Pictures[];

  @ValidateNested({ each: true })
  @Type(() => PicturesType)
  readonly picture_after: Pictures[];
}
