import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '@/order/order.service';
import { RepositoriesServiceMock } from '@/repositories/mocks/repositories.service.mock';
import { RepositoriesService } from '@/repositories/repositories.service';
import {
  createOrderDtoMock,
  orderEntityMock,
} from '../../../src/order/mocks/order.entity.mock';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

describe('OrderService', () => {
  let service: OrderService;
  const prismaKnowError: PrismaClientKnownRequestError =
    new PrismaClientKnownRequestError('BadRequest error', {
      clientVersion: 'test client version',
      code: 'test',
    });
  const prismaUnKnowError: PrismaClientUnknownRequestError =
    new PrismaClientUnknownRequestError('internal server error', {
      clientVersion: 'test',
    });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: RepositoriesService, useClass: RepositoriesServiceMock },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  describe('create Order', () => {
    it('should create order', async () => {
      service['repositoriesService']['order']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      const result = await service.create(createOrderDtoMock);
      expect(result).toEqual(orderEntityMock);
    });

    it('should throw error if order exist', async () => {
      try {
        await service.create(createOrderDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('order name already exist');
      }
    });

    it("should throw error if order isn't created (know error)", async () => {
      try {
        service['repositoriesService']['order']['findFirst'] = jest
          .fn()
          .mockResolvedValue(undefined);
        service['repositoriesService']['order']['create'] = jest
          .fn()
          .mockRejectedValue(prismaKnowError);
        await service.create(createOrderDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });

    it("should throw error if order isn't created (unknow error)", async () => {
      try {
        service['repositoriesService']['order']['findFirst'] = jest
          .fn()
          .mockResolvedValue(undefined);
        service['repositoriesService']['order']['create'] = jest
          .fn()
          .mockRejectedValue(prismaUnKnowError);
        await service.create(createOrderDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });
  });

  describe('find Order', () => {
    it('should get all orders', async () => {
      const result = await service.findAll();
      expect(result).toEqual([orderEntityMock]);
    });

    it('should get one order', async () => {
      const result = await service.findById(orderEntityMock.orderId);
      expect(result).toEqual(orderEntityMock);
    });

    it('should throw error if findById return undefined', async () => {
      try {
        service['repositoriesService']['order']['findUnique'] = jest
          .fn()
          .mockResolvedValue(undefined);
        await service.findById(orderEntityMock.orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          `OrderId : ${orderEntityMock.orderId} not found`,
        );
      }
    });

    it('should throw error if findUnique return an error (know)', async () => {
      try {
        service['repositoriesService']['order']['findUnique'] = jest
          .fn()
          .mockRejectedValue(prismaKnowError);
        await service.findById(orderEntityMock.orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });

    it('should throw error if findUnique return an error (unknow)', async () => {
      try {
        service['repositoriesService']['order']['findUnique'] = jest
          .fn()
          .mockRejectedValue(prismaUnKnowError);
        await service.findById(orderEntityMock.orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('should throw error if findMany return an error (know)', async () => {
      try {
        service['repositoriesService']['order']['findMany'] = jest
          .fn()
          .mockRejectedValue(prismaKnowError);
        await service.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });

    it('should throw error if findMany return an error (unKnow)', async () => {
      try {
        service['repositoriesService']['order']['findMany'] = jest
          .fn()
          .mockRejectedValue(prismaUnKnowError);
        await service.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('should throw error if findFirst return an error (know)', async () => {
      try {
        service['repositoriesService']['order']['findFirst'] = jest
          .fn()
          .mockRejectedValue(prismaKnowError);
        await service.searchName('test');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });

    it('should throw error if findFirst return an error (unKnow)', async () => {
      try {
        service['repositoriesService']['order']['findFirst'] = jest
          .fn()
          .mockRejectedValue(prismaUnKnowError);
        await service.searchName('test');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });
  });

  describe('update Order', () => {
    it('should update order', async () => {
      const result = await service.update(
        orderEntityMock.orderId,
        createOrderDtoMock,
      );
      expect(result).toEqual(orderEntityMock);
    });

    it('should throw error if update return an error (know)', async () => {
      try {
        service['repositoriesService']['order']['update'] = jest
          .fn()
          .mockRejectedValue(prismaKnowError);
        await service.update(orderEntityMock.orderId, createOrderDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });

    it('should throw error if update return an error (unknow)', async () => {
      try {
        service['repositoriesService']['order']['update'] = jest
          .fn()
          .mockRejectedValue(prismaUnKnowError);
        await service.update(orderEntityMock.orderId, createOrderDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });
  });

  describe('delete Order', () => {
    it('should delete order', async () => {
      const result = await service.delete(orderEntityMock.orderId);
      expect(result).toEqual(orderEntityMock);
    });

    it('should throw error if delete return an error (know)', async () => {
      try {
        service['repositoriesService']['order']['delete'] = jest
          .fn()
          .mockRejectedValue(prismaKnowError);
        await service.delete(orderEntityMock.orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });

    it('should throw error if delete return an error (unknow)', async () => {
      try {
        service['repositoriesService']['order']['delete'] = jest
          .fn()
          .mockRejectedValue(prismaUnKnowError);
        await service.delete(orderEntityMock.orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });
  });
});
