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
import { ApiProperty } from '@nestjs/swagger';
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly comment: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressType)
  @IsOptional()
  readonly address: Address;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  readonly started_at: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  readonly finished_at: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly authorId: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  readonly usersId: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  readonly productsId: string[];

  @ValidateNested({ each: true })
  @Type(() => PicturesType)
  @IsOptional()
  @ApiProperty()
  readonly picture_before: Pictures[];

  @ValidateNested({ each: true })
  @Type(() => PicturesType)
  @IsOptional()
  @ApiProperty()
  readonly picture_after: Pictures[];
}
