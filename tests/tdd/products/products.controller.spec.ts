import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../../src/products/products.controller';
import { ProductsService } from '../../../src/products/products.service';
import { ProductServiceMock } from '../../../src/products/mocks/product.service.mock';
import {
  createProductDtoMock,
  expectedProductEntityMock,
  productEntityMock,
} from '../../../src/products/mocks/product.entity.mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        JwtService,
        ConfigService,
        { provide: ProductsService, useClass: ProductServiceMock },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be create product', async () => {
    const product = await controller.create(createProductDtoMock);
    expect(product).toBeDefined();
    expect(product).toEqual(expectedProductEntityMock);
  });

  it('should be get all products', async () => {
    const products = await controller.findAll();
    expect(products).toBeDefined();
    expect(products).toEqual([expectedProductEntityMock]);
  });

  it('should be get one product', async () => {
    const product = await controller.findById(productEntityMock.productId);
    expect(product).toBeDefined();
    expect(product).toEqual(expectedProductEntityMock);
  });

  it('should be update product', async () => {
    const product = await controller.update(
      createProductDtoMock,
      productEntityMock.productId,
    );
    expect(product).toBeDefined();
    expect(product).toEqual(expectedProductEntityMock);
  });

  it('should be delete product', async () => {
    const product = await controller.delete(productEntityMock.productId);
    expect(product).toBeDefined();
    expect(product).toEqual('Le produit à été supprimé');
  });
});
