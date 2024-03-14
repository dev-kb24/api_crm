import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../../src/products/products.service';
import { RepositoriesService } from '@/repositories/repositories.service';
import { RepositoriesServiceMock } from '@/repositories/mocks/repositories.service.mock';
import {
  productEntityMock,
  createProductDtoMock,
} from '../../../src/products/mocks/product.entity.mock';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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

  describe('create product', () => {
    it('should create product -  ordersId no empty', async () => {
      service['repositoriesService']['products']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      const result = await service.create(createProductDtoMock);
      expect(result).toEqual(productEntityMock);
    });

    it('should create product -  ordersId is empty', async () => {
      createProductDtoMock.ordersId = [];
      service['repositoriesService']['products']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      const result = await service.create(createProductDtoMock);
      expect(result).toEqual(productEntityMock);
    });

    it('should create product -  ordersId no existing', async () => {
      delete createProductDtoMock.ordersId;
      service['repositoriesService']['products']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      const result = await service.create(createProductDtoMock);
      expect(result).toEqual(productEntityMock);
    });

    it('Should return an error if product already exist', async () => {
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

    it('Should return an error if the create function returns an error.', async () => {
      try {
        service['repositoriesService']['products']['findFirst'] = jest
          .fn()
          .mockResolvedValue(undefined);
        service['repositoriesService']['products']['create'] = jest
          .fn()
          .mockRejectedValue(new Error('internal server error'));
        await service.create(createProductDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('Should return an error if the create function returns an error.', async () => {
      try {
        service['repositoriesService']['products']['findFirst'] = jest
          .fn()
          .mockRejectedValue(new Error('internal server error'));
        await service.create(createProductDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });
  });

  describe('find products', () => {
    it('should get all products', async () => {
      service['repositoriesService']['products']['findMany'] = jest
        .fn()
        .mockResolvedValue([productEntityMock]);
      const result = await service.findAll();
      expect(result).toEqual([productEntityMock]);
    });

    it('should get one product', async () => {
      const result = await service.findById(productEntityMock.productId);
      expect(result).toEqual(productEntityMock);
    });

    it('should return error if findById return undefined', async () => {
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

    it('should return error if findUnique return an error', async () => {
      try {
        service['repositoriesService']['products']['findUnique'] = jest
          .fn()
          .mockRejectedValue(new Error('internal server error'));
        await service.findById(productEntityMock.productId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('should return error if findMany return an error', async () => {
      try {
        service['repositoriesService']['products']['findMany'] = jest
          .fn()
          .mockRejectedValue(new Error('internal server error'));
        await service.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });
  });

  describe('update product', () => {
    it('should be update product', async () => {
      const result = await service.update(
        createProductDtoMock,
        productEntityMock.productId,
      );
      expect(result).toEqual(productEntityMock);
    });

    it('should return error if findUnique return undefined', async () => {
      try {
        service['repositoriesService']['products']['findUnique'] = jest
          .fn()
          .mockResolvedValue(undefined);
        await service.update(createProductDtoMock, productEntityMock.productId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          `ProductId : ${productEntityMock.productId} not found`,
        );
      }
    });

    it('should return error if update return an error', async () => {
      try {
        service['repositoriesService']['products']['update'] = jest
          .fn()
          .mockRejectedValue(new Error('internal server error'));
        await service.update(createProductDtoMock, productEntityMock.productId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });
  });

  describe('delete product', () => {
    it('should be delete product', async () => {
      const result = await service.delete(productEntityMock.productId);
      expect(result).toEqual(productEntityMock);
    });

    it('should return error if findUnique return undefined', async () => {
      try {
        service['repositoriesService']['products']['findUnique'] = jest
          .fn()
          .mockResolvedValue(undefined);
        await service.delete(productEntityMock.productId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          `ProductId : ${productEntityMock.productId} not found`,
        );
      }
    });

    it('should return error if delete return an error', async () => {
      try {
        service['repositoriesService']['products']['delete'] = jest
          .fn()
          .mockRejectedValue(new Error('internal server error'));
        await service.delete(productEntityMock.productId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });
  });
});
