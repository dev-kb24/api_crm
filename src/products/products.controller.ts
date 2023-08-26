import { Controller, Get, Post, Put, Delete, ConflictException } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators'
import { InputProduct } from './dto/inputProduct';
import { ProductsService } from './products.service';
import { OutputProduct } from './dto/outputProduct';
import { InputProductId } from './dto/inputProductId';

@Controller('products')
export class ProductsController {
    constructor(private productsService : ProductsService){}

    @Post()
    async create(@Body() inputProduct : InputProduct) : Promise<OutputProduct>{
        return await this.productsService.create(inputProduct);
    }

    @Put(":productId")
    async update(@Body() inputProduct : InputProduct, @Param() inputProductId: InputProductId) : Promise<OutputProduct> {
        return this.productsService.update(inputProduct,inputProductId);
    }
    
    @Delete(":productId")
    async delete(@Param() inputProductId : InputProductId) : Promise<OutputProduct>{
        return this.productsService.delete(inputProductId);
    }

    @Get()
    async findAll() : Promise<OutputProduct[]>{
        return this.productsService.findAll();
    }

    @Get(":productId")
    async findById(@Param() inputProductId : InputProductId) : Promise<OutputProduct>{
        return this.productsService.findById(inputProductId);
    }

}
