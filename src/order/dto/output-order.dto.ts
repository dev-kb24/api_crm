import { ProductEntity } from '@/products/entities/productEntity';
import { AddressEntity } from '@/order/entities/address.entity';
import { PicturesEntity } from '@/order/entities/pictures.entity';
import { Exclude } from 'class-transformer';

export class OutputOrderDto {
  readonly name: string;
  readonly comment: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly started_at: Date;
  readonly finished_at: Date;
  readonly authorId: string;
  @Exclude()
  readonly usersId: Array<string>;
  @Exclude()
  readonly productsId: Array<string>;
  readonly users: Array<any>;
  readonly products: Array<ProductEntity>;
  readonly address: AddressEntity;
  readonly picture_before: PicturesEntity | any;
  readonly picture_after: PicturesEntity | any;

  constructor(partial: Partial<OutputOrderDto>) {
    Object.assign(this, partial);
  }
}
