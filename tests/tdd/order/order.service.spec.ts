import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '@/order/order.service';
import { RepositoriesServiceMock } from '@/repositories/mocks/repositories.service.mock';
import { RepositoriesService } from '@/repositories/repositories.service';
import { createOrderDtoMock, orderEntityMock } from '../../../src/order/mocks/order.entity.mock';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: RepositoriesService, useClass: RepositoriesServiceMock },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be create order', async () => {
    service['repositoriesService']['order']['findFirst'] = jest
      .fn()
      .mockResolvedValue(undefined);
    const result = await service.create(createOrderDtoMock);
    expect(result).toEqual(orderEntityMock);
  });
  it('should be get all orders', async () => {
    const result = await service.findAll();
    expect(result).toEqual([orderEntityMock]);
  });

  it('should be get one order', async () => {
    const result = await service.findById(orderEntityMock.orderId);
    expect(result).toEqual(orderEntityMock);
  });

  it('should be update order', async () => {
    const result = await service.update(
      orderEntityMock.orderId,
      createOrderDtoMock,
    );
    expect(result).toEqual(orderEntityMock);
  });

  it('should be delete order', async () => {
    const result = await service.delete(orderEntityMock.orderId);
    expect(result).toEqual(orderEntityMock);
  });

  it('should be throw error if order exist', async () => {
    try {
      await service.create(createOrderDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual('order name already exist');
    }
  });

  it("should be throw error if order isn't created", async () => {
    try {
      service['repositoriesService']['order']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      service['repositoriesService']['order']['create'] = jest
        .fn()
        .mockRejectedValue(new Error('error'));
      await service.create(createOrderDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('error');
    }
  });

  it('should be throw error if findById return undefined', async () => {
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

  it('should be throw error if update return error', async () => {
    try {
      service['repositoriesService']['order']['update'] = jest
        .fn()
        .mockRejectedValue(new Error('error'));
      await service.update(orderEntityMock.orderId, createOrderDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('error');
    }
  });

  it('should be throw error if delete return error', async () => {
    try {
      service['repositoriesService']['order']['delete'] = jest
        .fn()
        .mockRejectedValue(new Error('error'));
      await service.delete(orderEntityMock.orderId);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('error');
    }
  });
});
