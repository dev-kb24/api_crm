import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RepositoriesService } from '@/repositories/repositories.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Suppliers } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Suppliers> {
    const { raisonSocial } = createSupplierDto;
    const supplierExist = await this.repositoriesService.suppliers.findFirst({
      where: { raisonSocial: raisonSocial },
    });
    if (supplierExist) {
      throw new ConflictException('supplier already exist');
    }
    try {
      return await this.repositoriesService.suppliers.create({
        data: createSupplierDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Suppliers[]> {
    try {
      return await this.repositoriesService.suppliers.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(supplierId: string): Promise<Suppliers> {
    let supplier: Suppliers;
    try {
      supplier = await this.repositoriesService.suppliers.findUnique({
        where: { suppliersId: supplierId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!supplier) {
      throw new NotFoundException(`SupplierId : ${supplierId} not found`);
    }
    return supplier;
  }

  async update(
    supplierId: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Suppliers> {
    await this.findById(supplierId);
    try {
      return await this.repositoriesService.suppliers.update({
        where: { suppliersId: supplierId },
        data: updateSupplierDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(supplierId: string): Promise<Suppliers> {
    await this.findById(supplierId);
    try {
      return await this.repositoriesService.suppliers.delete({
        where: { suppliersId: supplierId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
