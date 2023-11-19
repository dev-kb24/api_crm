import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from '@/order/dto/create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
