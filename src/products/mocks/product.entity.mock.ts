import { ProductEntity } from "../entities/productEntity";

export const productEntityMock: ProductEntity = {
    productId: 'test',
    name: 'test',
    comment: 'test',
    stock: 1,
    created_at: new Date(),
    updated_at: new Date()
}

export const expectedProductEntityMock: any = { 
    name: 'test',
    comment: 'test',
    stock: 1,
    created_at: new Date(),
    updated_at: new Date(),
    order:[]
}

export const createProductDtoMock: any = {
    name: 'test',
    comment: 'test',
    stock: 1,
}