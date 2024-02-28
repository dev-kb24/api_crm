import { OutputProductDto } from '@/products/dto/output-product.dto';
import { OutputUserDto } from '@/users/dto/output-user.dto';
import { Address, Pictures, Products, Users } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

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

  @Transform(({ value }) => value.map((user: Users) => new OutputUserDto(user)))
  readonly users: Array<Users>;

  @Transform(({ value }) =>
    value.map((product: Products) => new OutputProductDto(product)),
  )
  readonly products: Array<Products>;

  readonly address: Address;
  readonly picture_before: Pictures[];
  readonly picture_after: Pictures[];

  constructor(partial: Partial<OutputOrderDto>) {
    Object.assign(this, partial);
  }
}
