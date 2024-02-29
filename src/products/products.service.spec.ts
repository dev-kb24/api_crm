import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { RepositoriesService } from '@/repositories/repositories.service';
import { RepositoriesServiceMock } from '@/repositories/mocks/repositories.service.mock';
import {
  productEntityMock,
  createProductDtoMock,
} from './mocks/product.entity.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: RepositoriesService, useClass: RepositoriesServiceMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be create product', async () => {
    service['repositoriesService']['products']['findFirst'] = jest
      .fn()
      .mockResolvedValue(undefined);
    const result = await service.create(createProductDtoMock);
    expect(result).toEqual(productEntityMock);
  });

  it('should be get all products', async () => {
    service['repositoriesService']['products']['findMany'] = jest
      .fn()
      .mockResolvedValue([productEntityMock]);
    const result = await service.findAll();
    expect(result).toEqual([productEntityMock]);
  });

  it('should be get one product', async () => {
    const result = await service.findById(productEntityMock.productId);
    expect(result).toEqual(productEntityMock);
  });

  it('should be update product', async () => {
    const result = await service.update(
      createProductDtoMock,
      productEntityMock.productId,
    );
    expect(result).toEqual(productEntityMock);
  });

  it('should be delete product', async () => {
    const result = await service.delete(productEntityMock.productId);
    expect(result).toEqual(productEntityMock);
  });

  it('should be throw error if product exist', async () => {
    try {
      service['repositoriesService']['products']['findFirst'] = jest
        .fn()
        .mockResolvedValue(productEntityMock);
      await service.create(createProductDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual('product already exist');
    }
  });

  it('should be throw error if findById return undefined', async () => {
    try {
      service['repositoriesService']['products']['findUnique'] = jest
        .fn()
        .mockResolvedValue(undefined);
      await service.findById(productEntityMock.productId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual(
        `ProductId : ${productEntityMock.productId} not found`,
      );
    }
  });
});
