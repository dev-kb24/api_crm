import { Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Categories, Order, Pictures, References } from '@prisma/client';
import { OutputOrderDto } from '@/order/dto/output-order.dto';
export class OutputProductDto {
  @ApiProperty()
  readonly productId: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly comment: string;
  @ApiProperty()
  readonly price: number;
  @ApiProperty()
  readonly stock: number;
  @ApiProperty()
  readonly created_at: Date;
  @ApiProperty()
  readonly updated_at: Date;
  @ApiProperty()
  readonly reference: References;
  @ApiProperty()
  readonly product_picture: Pictures[];
  @ApiProperty()
  readonly weight: number;
  @ApiProperty()
  readonly height: number;
  @ApiProperty()
  readonly width: number;
  @ApiProperty()
  readonly length: number;
  @Exclude()
  readonly ordersId: Array<string>;
  @ApiProperty()
  @Transform(({ value }) =>
    value.map((order: Order) => new OutputOrderDto(order)),
  )
  readonly order: Array<Order>;
  @ApiProperty()
  readonly categories: Array<Categories>;

  constructor(partial: Partial<OutputProductDto>) {
    Object.assign(this, partial);
  }
}
