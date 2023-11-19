import { expectedOrderEntityMock, orderEntityMock } from "@/order/mocks/entitiesMock/entities.mock";

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
    }

    users = {
        findMany: jest.fn().mockResolvedValue([{userId:1,ordersId:["1234567891234567"]}]),
        updateMany: jest.fn().mockResolvedValue([{userId:1,ordersId:["1234567891234567"]}]), 
    }
}