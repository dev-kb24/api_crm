import {orderEntityMock } from "@/order/mocks/entitiesMock/entities.mock";
import { productEntityMock } from "@/products/mocks/product.entity.mock";

export class RepositoriesServiceMock{
    order = {
        create: jest.fn().mockResolvedValue(orderEntityMock),
        findFirst: jest.fn().mockResolvedValue(orderEntityMock),
        findMany: jest.fn().mockResolvedValue([orderEntityMock]),
        findUnique: jest.fn().mockResolvedValue(orderEntityMock),
        delete: jest.fn().mockResolvedValue(orderEntityMock),
        update: jest.fn().mockResolvedValue(orderEntityMock),
    }

    products = {
        findMany: jest.fn().mockResolvedValue([{productId:1,ordersId:["1234567891234567"]}]),
        updateMany: jest.fn().mockResolvedValue([{productId:1,ordersId:["1234567891234567"]}]),    
        findFirst: jest.fn().mockResolvedValue(productEntityMock),
        create: jest.fn().mockResolvedValue(productEntityMock),
        findUnique: jest.fn().mockResolvedValue(productEntityMock),
        delete: jest.fn().mockResolvedValue(productEntityMock),
        update: jest.fn().mockResolvedValue(productEntityMock)
    }

    users = {
        findMany: jest.fn().mockResolvedValue([{userId:1,ordersId:["1234567891234567"]}]),
        updateMany: jest.fn().mockResolvedValue([{userId:1,ordersId:["1234567891234567"]}]), 
    }
}