import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ProductsService],
  imports: [JwtModule],
})
export class ProductsModule {}
