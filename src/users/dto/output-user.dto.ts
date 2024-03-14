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
  @Exclude()
  readonly code_email: string;
  @Exclude()
  readonly user_is_valid: boolean;
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
