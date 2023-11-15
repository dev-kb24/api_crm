import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { InputSuppliersId } from './dto/inputSupplierId';
import { UsersGuard } from '@/users/users.guard';
import { OutputSupplier } from './dto/outputSupplier';
import { InputSupplier } from './dto/inputSupplier';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @UseInterceptors(ClassSerializerInterceptor) 
  @UseGuards(UsersGuard)
  @Post()
  async create(@Body() inputSupplier: InputSupplier) : Promise<OutputSupplier>
  {
    return new OutputSupplier(await this.suppliersService.create(inputSupplier));
  }

  @UseInterceptors(ClassSerializerInterceptor) 
  @UseGuards(UsersGuard)  
  @Get()
  async findAll() : Promise<OutputSupplier[]>
  {
    const suppliers = await this.suppliersService.findAll();
    return suppliers.map(supplier => new OutputSupplier(supplier));
  }

  @UseInterceptors(ClassSerializerInterceptor) 
  @UseGuards(UsersGuard)  
  @Get(':suppliersId')
  async findOne(@Param() inputSuppliersId: InputSuppliersId) : Promise<OutputSupplier>
  {
    return new OutputSupplier(await this.suppliersService.findById(inputSuppliersId));
  }

  @UseInterceptors(ClassSerializerInterceptor) 
  @UseGuards(UsersGuard)
  @Put(':suppliersId')
  async update(@Param() inputSuppliersId: InputSuppliersId, @Body() inputSupplier: InputSupplier) : Promise<OutputSupplier>
  {
    return new OutputSupplier(await this.suppliersService.update(inputSuppliersId, inputSupplier));
  }

  @UseGuards(UsersGuard)
  @Delete(':suppliersId')
  async remove(@Param() inputSuppliersId: InputSuppliersId) : Promise<String>
  {
    await this.suppliersService.remove(inputSuppliersId);
    return  "le fournisseur a été supprimé";
  }
}
