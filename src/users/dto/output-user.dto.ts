import { OutputOrderDto } from '@/order/dto/output-order.dto';
import { Order, Pictures } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
export class OutputUserDto {
  readonly userId: string;
  readonly email: string;
  readonly civility: number;
  readonly firstname: string;
  readonly lastname: string;
  @Exclude()
  readonly password: string;
  readonly fonction: string;
  readonly avatar: Pictures;
  @Exclude()
  readonly ordersId: Array<string>;
  @Transform(({ value }) =>
    value.map((order: Order) => new OutputOrderDto(order)),
  )
  readonly order: Array<Order>;

  constructor(partial: Partial<OutputUserDto>) {
    Object.assign(this, partial);
  }
}
