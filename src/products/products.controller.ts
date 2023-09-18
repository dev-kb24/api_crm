import { Controller, Get, Post, Put, Delete, ClassSerializerInterceptor } from '@nestjs/common';
import { Body, Param, UseGuards, UseInterceptors } from '@nestjs/common/decorators'
import { InputProduct } from './dto/inputProduct';
import { ProductsService } from './products.service';
import { OutputProduct } from './dto/outputProduct';
import { InputProductId } from './dto/inputProductId';
import { UsersGuard } from 'src/users/users.guard';
import { InputProductUpdate } from './dto/inputProductUpdate';

@Controller('products')
export class ProductsController {
    constructor(private productsService : ProductsService){}

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(UsersGuard)
    @Post()
    async create(@Body() inputProduct : InputProduct) : Promise<OutputProduct>{
        return new OutputProduct(await this.productsService.create(inputProduct));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(UsersGuard)
    @Put(":productId")
    async update(@Body() inputProduct : InputProductUpdate, @Param() inputProductId: InputProductId) : Promise<OutputProduct> {
        return new OutputProduct(await this.productsService.update(inputProduct,inputProductId));
    }

    @UseGuards(UsersGuard)
    @Delete(":productId")
    async delete(@Param() inputProductId : InputProductId) : Promise<String>{
       await this.productsService.delete(inputProductId);
       return 'Le produit à été supprimé'
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(UsersGuard)
    @Get()
    async findAll() : Promise<OutputProduct[]>{
        const products = await this.productsService.findAll();
        return products.map(product => new OutputProduct(product))
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(UsersGuard)
    @Get(":productId")
    async findById(@Param() inputProductId : InputProductId) : Promise<OutputProduct>{
        return new OutputProduct(await this.productsService.findById(inputProductId));
    }

}
