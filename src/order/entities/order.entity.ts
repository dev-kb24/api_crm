import { ProductEntity } from '@/products/entities/productEntity';
import { AddressEntity } from '@/order/entities/address.entity';
import { PicturesEntity } from '@/order/entities/pictures.entity';
export class OrderEntity {
  readonly orderId: string;
  readonly name: string;
  readonly comment: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly started_at: Date;
  readonly finished_at: Date;
  readonly authorId: string;
  readonly usersId: Array<string>;
  readonly productsId: Array<string>;
  readonly users: Array<any>;
  readonly products: Array<ProductEntity>;
  readonly address: AddressEntity;
  readonly picture_before: PicturesEntity | any;
  readonly picture_after: PicturesEntity | any;
}
