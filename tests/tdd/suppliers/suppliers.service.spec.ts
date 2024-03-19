import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from '../../../src/suppliers/suppliers.service';
import {
  createSupplierDtoMock,
  supplierEntityMock,
  updateSupplierDtoMock,
} from '../../../src/suppliers/mocks/supplier.entity.mock';
import { RepositoriesService } from '@/repositories/repositories.service';
import { RepositoriesServiceMock } from '@/repositories/mocks/repositories.service.mock';
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

describe('SuppliersService', () => {
  let service: SuppliersService;
  const errorKnow = new PrismaClientKnownRequestError('BadRequest error', {
    clientVersion: 'test client version',
    code: 'test code',
  });
  const errorUnKnow = new PrismaClientUnknownRequestError(
    'internal server error',
    {
      clientVersion: 'client test version',
    },
  );
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        { provide: RepositoriesService, useClass: RepositoriesServiceMock },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
  });

  describe('create supplier', () => {
    it('should create supplier', async () => {
      service['repositoriesService']['suppliers']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      const supplier = await service.create(createSupplierDtoMock);
      expect(supplier).toEqual(supplierEntityMock);
    });

    it('should be throw error if supplier exist', async () => {
      try {
        await service.create(createSupplierDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('supplier already exist');
      }
    });

    it('should create supplier - throw internal error. (create 500)', async () => {
      service['repositoriesService']['suppliers']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      service['repositoriesService']['suppliers']['create'] = jest
        .fn()
        .mockRejectedValue(errorUnKnow);
      try {
        await service.create(createSupplierDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('should create supplier - throw internal error. (create 400)', async () => {
      service['repositoriesService']['suppliers']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      service['repositoriesService']['suppliers']['create'] = jest
        .fn()
        .mockRejectedValue(errorKnow);
      try {
        await service.create(createSupplierDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });
  });

  describe('find supplier', () => {
    it('should get all suppliers', async () => {
      const suppliers = await service.findAll();
      expect(suppliers).toEqual([supplierEntityMock]);
    });

    it('should get all suppliers -  throw internal error', async () => {
      service['repositoriesService']['suppliers']['findMany'] = jest
        .fn()
        .mockRejectedValue(errorUnKnow);
      try {
        await service.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('should get all suppliers -  throw bad request error', async () => {
      service['repositoriesService']['suppliers']['findMany'] = jest
        .fn()
        .mockRejectedValue(errorKnow);
      try {
        await service.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });

    it('should get one supplier', async () => {
      const supplier = await service.findById(supplierEntityMock.suppliersId);
      expect(supplier).toEqual(supplierEntityMock);
    });

    it('should be throw error if findById return undefined', async () => {
      try {
        service['repositoriesService']['suppliers']['findUnique'] = jest
          .fn()
          .mockResolvedValue(undefined);
        await service.findById(supplierEntityMock.suppliersId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          `SupplierId : ${supplierEntityMock.suppliersId} not found`,
        );
      }
    });

    it('should get one supplier -  throw internal error', async () => {
      service['repositoriesService']['suppliers']['findUnique'] = jest
        .fn()
        .mockRejectedValue(errorUnKnow);
      try {
        await service.findById(supplierEntityMock.suppliersId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('should get one supplier -  throw bad request error', async () => {
      service['repositoriesService']['suppliers']['findUnique'] = jest
        .fn()
        .mockRejectedValue(errorKnow);
      try {
        await service.findById(supplierEntityMock.suppliersId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });
  });

  describe('update user', () => {
    it('should update supplier', async () => {
      const supplier = await service.update(
        supplierEntityMock.suppliersId,
        updateSupplierDtoMock,
      );
      expect(supplier).toEqual(supplierEntityMock);
    });

    it('should update supplier - throw internal server error', async () => {
      service['repositoriesService']['suppliers']['update'] = jest
        .fn()
        .mockRejectedValue(errorUnKnow);
      try {
        await service.update(
          supplierEntityMock.suppliersId,
          updateSupplierDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('should update supplier - throw bad request error', async () => {
      service['repositoriesService']['suppliers']['update'] = jest
        .fn()
        .mockRejectedValue(errorKnow);
      try {
        await service.update(
          supplierEntityMock.suppliersId,
          updateSupplierDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });
  });

  describe('delete user', () => {
    it('should delete supplier', async () => {
      const supplier = await service.delete(supplierEntityMock.suppliersId);
      expect(supplier).toEqual(supplierEntityMock);
    });

    it('should delete supplier - throw internal server error', async () => {
      service['repositoriesService']['suppliers']['delete'] = jest
        .fn()
        .mockRejectedValue(errorUnKnow);
      try {
        await service.delete(supplierEntityMock.suppliersId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('should delete supplier - throw bad request error', async () => {
      service['repositoriesService']['suppliers']['delete'] = jest
        .fn()
        .mockRejectedValue(errorKnow);
      try {
        await service.delete(supplierEntityMock.suppliersId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });
  });
});
