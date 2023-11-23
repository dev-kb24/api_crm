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
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly comment: string;

  @IsObject()
  @IsNotEmpty()
  readonly address: AddressEntity;

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

  @IsObject()
  @IsOptional()
  readonly picture_before: PicturesEntity;

  @IsObject()
  @IsOptional()
  readonly picture_after: PicturesEntity;
}
