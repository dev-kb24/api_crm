import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, ClassSerializerInterceptor, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OutputOrder } from './dto/outputOrder';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) : Promise<OutputOrder> 
  {
    return new OutputOrder(await this.orderService.create(createOrderDto));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() : Promise<OutputOrder[]>
  {
    const orders = await this.orderService.findAll();
    return orders.map(order => new OutputOrder(order))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') orderId: string) {
    return new OutputOrder(await this.orderService.findById(orderId));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  async update(@Param('id') orderId: string, @Body() updateOrderDto: UpdateOrderDto) : Promise<OutputOrder>
  {
    return new OutputOrder(await this.orderService.update(orderId, updateOrderDto));
  }

  @Delete(':id')
  async remove(@Param('id') orderId: string) {
    await this.orderService.delete(orderId);
    return 'Le produit à été supprimé'
  }
}
