import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '@/order/order.service';
import { CreateOrderDto } from '@/order/dto/create-order.dto';
import { UpdateOrderDto } from '@/order/dto/update-order.dto';
import { OutputOrderDto } from '@/order/dto/output-order.dto';
import { UsersGuard } from '@/users/users.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OutputOrderDto> {
    return new OutputOrderDto(await this.orderService.create(createOrderDto));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Get()
  async findAll(): Promise<OutputOrderDto[]> {
    const orders = await this.orderService.findAll();
    return orders.map((order) => new OutputOrderDto(order));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Get(':id')
  async findOne(@Param('id') orderId: string) {
    return new OutputOrderDto(await this.orderService.findById(orderId));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Put(':id')
  async update(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OutputOrderDto> {
    return new OutputOrderDto(
      await this.orderService.update(orderId, updateOrderDto),
    );
  }

  @UseGuards(UsersGuard)
  @Delete(':id')
  async delete(@Param('id') orderId: string) {
    await this.orderService.delete(orderId);
    return 'Le devis à été supprimé';
  }
}
