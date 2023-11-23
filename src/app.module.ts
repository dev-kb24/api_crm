import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './products/products.service';
import { JwtModule } from '@nestjs/jwt';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    RepositoriesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule,
    SuppliersModule,
    OrderModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
