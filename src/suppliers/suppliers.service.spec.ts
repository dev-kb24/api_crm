import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { createSupplierDtoMock, supplierEntityMock, updateSupplierDtoMock } from './mocks/supplier.entity.mock';
import { RepositoriesService } from '@/repositories/repositories.service';
import { RepositoriesServiceMock } from '@/repositories/mocks/repositories.service.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SuppliersService', () => {
  let service: SuppliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliersService,{provide:RepositoriesService,useClass:RepositoriesServiceMock}],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
  });

 it('should be create supplier', async () => {
    service['repositoriesService']['suppliers']['findFirst'] = jest.fn().mockResolvedValue(undefined);
    const supplier = await service.create(createSupplierDtoMock);
    expect(supplier).toEqual(supplierEntityMock);
  });

  it('should be get all suppliers', async () => {
    const suppliers = await service.findAll();
    expect(suppliers).toEqual([supplierEntityMock]);
  });

  it('should be get one supplier', async () => {
    const supplier = await service.findById(supplierEntityMock.suppliersId);
    expect(supplier).toEqual(supplierEntityMock);
  });

  it('should be update supplier', async () => {
    const supplier = await service.update(supplierEntityMock.suppliersId,updateSupplierDtoMock);
    expect(supplier).toEqual(supplierEntityMock);
  });

  it('should be delete supplier', async () => {
    const supplier = await service.delete(supplierEntityMock.suppliersId);
    expect(supplier).toEqual(supplierEntityMock);
  });

  it("should be throw error if supplier exist", async () => {
    try {
      await service.create(createSupplierDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException)
      expect(error.message).toEqual("supplier already exist")
    }
  })

  it("should be throw error if findById return undefined", async () => {  
    try {
      service['repositoriesService']['suppliers']['findUnique'] = jest.fn().mockResolvedValue(undefined);
      await service.findById(supplierEntityMock.suppliersId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toEqual(`SupplierId : ${supplierEntityMock.suppliersId} not found`)
    }
  })
});
