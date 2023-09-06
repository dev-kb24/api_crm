import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { InputSuppliersId } from './dto/inputSupplierId';
import { UsersGuard } from 'src/users/users.guard';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @UseGuards(UsersGuard)
  @Post()
  create(@Body() createSupplierDto: any) {
    return this.suppliersService.create(createSupplierDto);
  }

  @UseGuards(UsersGuard)  
  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @UseGuards(UsersGuard)  
  @Get(':suppliersId')
  findOne(@Param() inputSuppliersId: InputSuppliersId) {
    return this.suppliersService.findById(inputSuppliersId);
  }

  @UseGuards(UsersGuard)
  @Put(':suppliersId')
  update(@Param() inputSuppliersId: InputSuppliersId, @Body() updateSupplierDto: any) {
    return this.suppliersService.update(inputSuppliersId, updateSupplierDto);
  }

  @UseGuards(UsersGuard)
  @Delete(':suppliersId')
  remove(@Param() inputSuppliersId: InputSuppliersId) {
    return this.suppliersService.remove(inputSuppliersId);
  }
}
