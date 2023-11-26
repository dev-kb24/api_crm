import { orderEntityMock } from '@/order/mocks/order.entity.mock';
import { productEntityMock } from '@/products/mocks/product.entity.mock';
import { supplierEntityMock } from '@/suppliers/mocks/supplier.entity.mock';
import { userEntityMock } from '@/users/mocks/users.entity.mock';

export class RepositoriesServiceMock {
  order = {
    create: jest.fn().mockResolvedValue(orderEntityMock),
    findFirst: jest.fn().mockResolvedValue(orderEntityMock),
    findMany: jest.fn().mockResolvedValue([orderEntityMock]),
    findUnique: jest.fn().mockResolvedValue(orderEntityMock),
    delete: jest.fn().mockResolvedValue(orderEntityMock),
    update: jest.fn().mockResolvedValue(orderEntityMock),
  };

  products = {
    findMany: jest
      .fn()
      .mockResolvedValue([{ productId: 1, ordersId: ['1234567891234567'] }]),
    updateMany: jest
      .fn()
      .mockResolvedValue([{ productId: 1, ordersId: ['1234567891234567'] }]),
    findFirst: jest.fn().mockResolvedValue(productEntityMock),
    create: jest.fn().mockResolvedValue(productEntityMock),
    findUnique: jest.fn().mockResolvedValue(productEntityMock),
    delete: jest.fn().mockResolvedValue(productEntityMock),
    update: jest.fn().mockResolvedValue(productEntityMock),
  };

  suppliers = {
    findMany: jest.fn().mockResolvedValue([supplierEntityMock]),
    findFirst: jest.fn().mockResolvedValue(supplierEntityMock),
    create: jest.fn().mockResolvedValue(supplierEntityMock),
    findUnique: jest.fn().mockResolvedValue(supplierEntityMock),
    delete: jest.fn().mockResolvedValue(supplierEntityMock),
    update: jest.fn().mockResolvedValue(supplierEntityMock),
  };

  users = {
    findMany: jest
      .fn()
      .mockResolvedValue([{ userId: 1, ordersId: ['1234567891234567'] }]),
    updateMany: jest
      .fn()
      .mockResolvedValue([{ userId: 1, ordersId: ['1234567891234567'] }]),
    findFirst: jest.fn().mockResolvedValue(userEntityMock),
    create: jest.fn().mockResolvedValue(userEntityMock),
    findUnique: jest.fn().mockResolvedValue(userEntityMock),
    delete: jest.fn().mockResolvedValue(userEntityMock),
    update: jest.fn().mockResolvedValue(userEntityMock)
  };
}
