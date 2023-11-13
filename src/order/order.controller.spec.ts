import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '@/order/order.controller';
import { orderServiceMock } from '@/order/mocks/order.service.mock';
import { OrderService } from '@/order/order.service';
import { createOrderDtoMock, expectedOrderEntityMock } from './mocks/entitiesMock/entities.mock';
describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{provide:OrderService,useClass:orderServiceMock}],
      
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be create order', async () => {
    const order = await controller.create(createOrderDtoMock)
    expect(order).toBeDefined()
    expect(order).toEqual(expectedOrderEntityMock)
  });

  it('should be get all orders', async () => {
    const orders = await controller.findAll();
    expect(orders).toBeDefined()
    expect(orders).toEqual([expectedOrderEntityMock])
  });

  it('should be get one order', async () => {
    const order = await controller.findOne(expectedOrderEntityMock.orderId);
    expect(order).toBeDefined()
    expect(order).toEqual(expectedOrderEntityMock)
  });

  it('should be update order', async () => {
    const order = await controller.update(expectedOrderEntityMock.orderId,createOrderDtoMock);
    expect(order).toBeDefined()
    expect(order).toEqual(expectedOrderEntityMock)
  });

  it('should be delete order', async () => {
    const order = await controller.remove(expectedOrderEntityMock.orderId);
    expect(order).toBeDefined()
    expect(order).toEqual("Le produit à été supprimé")
  });
});
