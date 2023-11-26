import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsObject,
  IsArray,
} from 'class-validator';
import { AddressEntity } from '@/order/entities/address.entity';
import { PicturesEntity } from '@/order/entities/pictures.entity';
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

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  readonly address: AddressEntity;

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
  readonly usersId: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly productsId: string[];

  @IsObject()
  @IsOptional()
  @ApiProperty()
  readonly picture_before: PicturesEntity;

  @IsObject()
  @IsOptional()
  @ApiProperty()
  readonly picture_after: PicturesEntity;
}
