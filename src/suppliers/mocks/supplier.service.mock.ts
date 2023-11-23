import { expectedSupplierEntityMock } from './supplier.entity.mock';

export class SupplierServiceMock {
  create = jest.fn().mockResolvedValue(expectedSupplierEntityMock);
  findAll = jest.fn().mockResolvedValue([expectedSupplierEntityMock]);
  findById = jest.fn().mockResolvedValue(expectedSupplierEntityMock);
  update = jest.fn().mockResolvedValue(expectedSupplierEntityMock);
  delete = jest.fn().mockResolvedValue('le fournisseur a été supprimé');
}
