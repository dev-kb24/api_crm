import { OutputProductDto } from '@/products/dto/output-product.dto';
import { OutputUserDto } from '@/users/dto/output-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Address, Pictures, Products, Users } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

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
