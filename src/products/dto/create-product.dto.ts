import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Categories, Pictures, References } from '@prisma/client';
import { ReferencesType } from '@/utils/types/references.type';
import { Type } from 'class-transformer';
import { PicturesType } from '@/utils/types/pictures.type';
import { CategoriesType } from '@/utils/types/categories.type';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly comment: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly price: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  readonly stock: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ReferencesType)
  readonly reference: References;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PicturesType)
  readonly product_picture: Pictures[];

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly weight: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly height: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly width: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly length: number;

  @ApiProperty()
  @IsArray()
  readonly ordersId: Array<string>;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CategoriesType)
  readonly categories: Categories[];
}
