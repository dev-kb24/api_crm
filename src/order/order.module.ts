import { Module } from '@nestjs/common';
import { OrderService } from '@/order/order.service';
import { OrderController } from '@/order/order.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports:[JwtModule]
})
export class OrderModule {}
