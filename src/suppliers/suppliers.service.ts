import {
  ConflictException,
  Injectable,
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
    return await this.repositoriesService.suppliers.create({
      data: createSupplierDto,
    });
  }

  async findAll(): Promise<Suppliers[]> {
    return await this.repositoriesService.suppliers.findMany();
  }

  async findById(supplierId: string): Promise<Suppliers> {
    const supplier = await this.repositoriesService.suppliers.findUnique({
      where: { suppliersId: supplierId },
    });
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
    return await this.repositoriesService.suppliers.update({
      where: { suppliersId: supplierId },
      data: updateSupplierDto,
    });
  }

  async delete(supplierId: string): Promise<Suppliers> {
    await this.findById(supplierId);
    return await this.repositoriesService.suppliers.delete({
      where: { suppliersId: supplierId },
    });
  }
}
