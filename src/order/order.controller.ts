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
    return await this.orderService.create(createOrderDto);
    //return new OutputOrder(await this.orderService.create(createOrderDto));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() : Promise<OutputOrder[]>
  {
    const orders = await this.orderService.findAll();
    return orders.map(order => new OutputOrder(order))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
