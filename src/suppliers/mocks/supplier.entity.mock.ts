import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { SuppliersEntity } from '../entities/supplier.entity';

export const supplierEntityMock: SuppliersEntity = {
  suppliersId: '1234567891234567',
  raisonSocial: 'raison_social',
};

export const expectedSupplierEntityMock: CreateSupplierDto = {
  raisonSocial: 'raison_social',
};

export const createSupplierDtoMock: CreateSupplierDto = {
  raisonSocial: 'raison_social',
};

export const updateSupplierDtoMock: CreateSupplierDto = {
  raisonSocial: 'raison_social',
};
