import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBody,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { OutputProductDto } from './dto/output-product.dto';
import { UsersGuard } from '@/users/users.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Post()
  @ApiOkResponse({ description: 'Opération réussie', type: OutputProductDto })
  @ApiBody({ type: CreateProductDto })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<OutputProductDto> {
    return plainToInstance(
      OutputProductDto,
      await this.productsService.create(createProductDto),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Put(':id')
  @ApiOkResponse({ description: 'Opération réussie', type: OutputProductDto })
  @ApiBody({ type: CreateProductDto })
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') productId: string,
  ): Promise<OutputProductDto> {
    return plainToInstance(
      OutputProductDto,
      await this.productsService.update(updateProductDto, productId),
    );
  }

  @UseGuards(UsersGuard)
  @Delete(':id')
  @ApiNoContentResponse({ description: 'Le produit à été supprimé' })
  async delete(@Param('id') productId: string): Promise<string> {
    await this.productsService.delete(productId);
    return 'Le produit à été supprimé';
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Get()
  @ApiOkResponse({ description: 'Opération réussie', type: [OutputProductDto] })
  async findAll(): Promise<OutputProductDto[]> {
    const products = await this.productsService.findAll();
    return products.map((product) =>
      plainToInstance(OutputProductDto, product),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Get(':id')
  @ApiOkResponse({ description: 'Opération réussie', type: OutputProductDto })
  async findById(@Param('id') productId: string): Promise<OutputProductDto> {
    return plainToInstance(
      OutputProductDto,
      await this.productsService.findById(productId),
    );
  }
}
