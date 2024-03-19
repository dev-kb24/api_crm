import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RepositoriesService } from '@/repositories/repositories.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Suppliers } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findAll(): Promise<Suppliers[]> {
    try {
      return await this.repositoriesService.suppliers.findMany();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findById(supplierId: string): Promise<Suppliers> {
    let supplier: Suppliers;
    try {
      supplier = await this.repositoriesService.suppliers.findUnique({
        where: { suppliersId: supplierId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
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
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async delete(supplierId: string): Promise<Suppliers> {
    await this.findById(supplierId);
    try {
      return await this.repositoriesService.suppliers.delete({
        where: { suppliersId: supplierId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
