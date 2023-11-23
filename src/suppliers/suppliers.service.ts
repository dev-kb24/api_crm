import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoriesService } from '@/repositories/repositories.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SuppliersEntity } from './entities/supplier.entity';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<SuppliersEntity> {
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

  async findAll(): Promise<SuppliersEntity[]> {
    return await this.repositoriesService.suppliers.findMany();
  }

  async findById(supplierId: string): Promise<SuppliersEntity> {
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
  ): Promise<SuppliersEntity> {
    await this.findById(supplierId);
    return await this.repositoriesService.suppliers.update({
      where: { suppliersId: supplierId },
      data: updateSupplierDto,
    });
  }

  async delete(supplierId: string): Promise<SuppliersEntity> {
    await this.findById(supplierId);
    return await this.repositoriesService.suppliers.delete({
      where: { suppliersId: supplierId },
    });
  }
}
