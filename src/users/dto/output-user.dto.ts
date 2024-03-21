import { OutputOrderDto } from '@/order/dto/output-order.dto';
import { Order, Pictures } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
export class OutputUserDto {
  @Expose()
  readonly userId: string;
  @Expose()
  readonly email: string;
  @Expose()
  readonly civility: number;
  @Expose()
  readonly firstname: string;
  @Expose()
  readonly lastname: string;
  @Exclude()
  readonly password: string;
  @Expose()
  readonly fonction: string;
  @Exclude()
  readonly code_email: string;
  @Exclude()
  readonly user_is_valid: boolean;
  @Expose()
  readonly avatar: Pictures;
  @Exclude()
  readonly ordersId: Array<string>;
  @Expose()
  @Transform(({ value }) =>
    value?.map((order: Order) => new OutputOrderDto(order)),
  )
  readonly order: Array<Order>;
}
