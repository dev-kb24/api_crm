import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from '../../../src/suppliers/suppliers.controller';
import { SuppliersService } from '../../../src/suppliers/suppliers.service';
import { SupplierServiceMock } from '../../../src/suppliers/mocks/supplier.service.mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  createSupplierDtoMock,
  expectedSupplierEntityMock,
  supplierEntityMock,
  updateSupplierDtoMock,
} from '../../../src/suppliers/mocks/supplier.entity.mock';

describe('SuppliersController', () => {
  let controller: SuppliersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        JwtService,
        ConfigService,
        { provide: SuppliersService, useClass: SupplierServiceMock },
      ],
    }).compile();

    controller = module.get<SuppliersController>(SuppliersController);
  });

  it('should be create supplier', async () => {
    const supplier = await controller.create(createSupplierDtoMock);
    expect(supplier).toBeDefined();
    expect(supplier).toEqual(expectedSupplierEntityMock);
  });

  it('should be get all suppliers', async () => {
    const suppliers = await controller.findAll();
    expect(suppliers).toBeDefined();
    expect(suppliers).toEqual([expectedSupplierEntityMock]);
  });

  it('should be get one supplier', async () => {
    const supplier = await controller.findById(supplierEntityMock.suppliersId);
    expect(supplier).toBeDefined();
    expect(supplier).toEqual(expectedSupplierEntityMock);
  });

  it('should be update supplier', async () => {
    const supplier = await controller.update(
      supplierEntityMock.suppliersId,
      updateSupplierDtoMock,
    );
    expect(supplier).toBeDefined();
    expect(supplier).toEqual(expectedSupplierEntityMock);
  });

  it('should be delete supplier', async () => {
    const supplier = await controller.delete(supplierEntityMock.suppliersId);
    expect(supplier).toBeDefined();
    expect(supplier).toEqual('le fournisseur a été supprimé');
  });
});
