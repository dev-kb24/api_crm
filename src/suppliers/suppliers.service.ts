import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InputSuppliersId } from './dto/inputSupplierId';
import { RepositoriesService } from 'src/repositories/repositories.service';

@Injectable()
export class SuppliersService {
  constructor(private readonly repositoriesService: RepositoriesService){}
  async create(createSupplierDto: any) {
    const {raisonSocial} = createSupplierDto;
        const supplierExist = await this.repositoriesService.suppliers.findFirst({where:{raisonSocial:raisonSocial}})
        if(supplierExist){
            throw new ConflictException("supplier already exist");
        }
        return await this.repositoriesService.suppliers.create({data:createSupplierDto});
  }

  async findAll() {
    return await this.repositoriesService.suppliers.findMany();
  }

  async findById(inputSuppliersId: InputSuppliersId) {
    const { suppliersId } = inputSuppliersId;
      const supplier = await this.repositoriesService.suppliers.findUnique({where:{suppliersId:suppliersId}});
      if(!supplier){
          throw new NotFoundException(`SupplierId : ${suppliersId} not found`);
      }
      return supplier;
  }

  async update(inputSuppliersId: InputSuppliersId, updateSupplierDto: any) {
      const { suppliersId } = inputSuppliersId;
      await this.findById(inputSuppliersId)
      return await this.repositoriesService.suppliers.update({where:{suppliersId:suppliersId},data:updateSupplierDto});
  }

 async remove(inputSuppliersId: InputSuppliersId) {
      const { suppliersId } = inputSuppliersId;
      await this.findById(inputSuppliersId)
      return await this.repositoriesService.suppliers.delete({where:{suppliersId:suppliersId}})
  }
}
