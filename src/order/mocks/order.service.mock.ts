import { expectedOrderEntityMock } from "./entitiesMock/entities.mock";

export class orderServiceMock{
    create = jest.fn().mockResolvedValue(expectedOrderEntityMock)
    findAll = jest.fn().mockResolvedValue([expectedOrderEntityMock])
    findById = jest.fn().mockResolvedValue(expectedOrderEntityMock)
    update = jest.fn().mockResolvedValue(expectedOrderEntityMock)
    delete = jest.fn().mockResolvedValue("Le produit à été supprimé")
}