import { ProductEntity } from '@/products/entities/productEntity';
import { AddressEntity } from '@/order/entities/address.entity';
import { PicturesEntity } from '@/order/entities/pictures.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OutputOrderDto {
  @ApiProperty()
  readonly orderId: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly comment: string;
  @ApiProperty()
  readonly created_at: Date;
  @ApiProperty()
  readonly updated_at: Date;
  @ApiProperty()
  readonly started_at: Date;
  @ApiProperty()
  readonly finished_at: Date;
  @ApiProperty()
  readonly authorId: string;
  @Exclude()
  readonly usersId: Array<string>;
  @Exclude()
  readonly productsId: Array<string>;
  @ApiProperty()
  readonly users: Array<any>;
  @ApiProperty()
  readonly products: Array<ProductEntity>;
  @ApiProperty()
  readonly address: AddressEntity;
  @ApiProperty()
  readonly picture_before: PicturesEntity | any;
  @ApiProperty()
  readonly picture_after: PicturesEntity | any;

  constructor(partial: Partial<OutputOrderDto>) {
    Object.assign(this, partial);
  }
}
