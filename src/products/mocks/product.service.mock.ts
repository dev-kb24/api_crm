import { expectedProductEntityMock } from "./product.entity.mock";

export class ProductServiceMock{
    create = jest.fn().mockResolvedValue(expectedProductEntityMock)
    findAll = jest.fn().mockResolvedValue([expectedProductEntityMock])
    findById = jest.fn().mockResolvedValue(expectedProductEntityMock)
    update = jest.fn().mockResolvedValue(expectedProductEntityMock)
    delete = jest.fn().mockResolvedValue("Le produit à été supprimé")
}