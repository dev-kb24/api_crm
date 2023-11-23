import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { UsersGuard } from '@/users/users.guard';
import { OutputSupplierDto } from './dto/output-supplier.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Post()
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<OutputSupplierDto> {
    return new OutputSupplierDto(
      await this.suppliersService.create(createSupplierDto),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Get()
  async findAll(): Promise<OutputSupplierDto[]> {
    const suppliers = await this.suppliersService.findAll();
    return suppliers.map((supplier) => new OutputSupplierDto(supplier));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Get(':id')
  async findById(@Param('id') supplierId: string): Promise<OutputSupplierDto> {
    return new OutputSupplierDto(
      await this.suppliersService.findById(supplierId),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Put(':id')
  async update(
    @Param('id') supplierId: string,
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<OutputSupplierDto> {
    return new OutputSupplierDto(
      await this.suppliersService.update(supplierId, createSupplierDto),
    );
  }

  @UseGuards(UsersGuard)
  @Delete(':id')
  async delete(@Param('id') supplierId: string): Promise<string> {
    await this.suppliersService.delete(supplierId);
    return 'le fournisseur a été supprimé';
  }
}
