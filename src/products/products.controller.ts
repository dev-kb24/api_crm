import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators'
import { InputProduct } from './dto/inputProduct';
import { ProductsService } from './products.service';
import { OutputProduct } from './dto/outputProduct';
import { InputProductId } from './dto/inputProductId';
import { UsersGuard } from 'src/users/users.guard';

@Controller('products')
export class ProductsController {
    constructor(private productsService : ProductsService){}

    @UseGuards(UsersGuard)
    @Post()
    async create(@Body() inputProduct : InputProduct) : Promise<OutputProduct>{
        return await this.productsService.create(inputProduct);
    }

    @UseGuards(UsersGuard)
    @Put(":productId")
    async update(@Body() inputProduct : InputProduct, @Param() inputProductId: InputProductId) : Promise<OutputProduct> {
        return this.productsService.update(inputProduct,inputProductId);
    }

    @UseGuards(UsersGuard)
    @Delete(":productId")
    async delete(@Param() inputProductId : InputProductId) : Promise<OutputProduct>{
        return this.productsService.delete(inputProductId);
    }

    @UseGuards(UsersGuard)
    @Get()
    async findAll() : Promise<OutputProduct[]>{
        return this.productsService.findAll();
    }

    @UseGuards(UsersGuard)
    @Get(":productId")
    async findById(@Param() inputProductId : InputProductId) : Promise<OutputProduct>{
        return this.productsService.findById(inputProductId);
    }

}
