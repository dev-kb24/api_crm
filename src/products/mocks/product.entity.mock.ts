import { Categories, Pictures, Products, References } from '@prisma/client';
import { CreateProductDto } from '../dto/create-product.dto';

const product_pictureMock: Pictures = {
  path: 'path',
  name: 'name',
  format: 'format',
  created_at: new Date(),
};

const referenceMock: References = {
  id: 'test',
  model: 'test_model',
  mark: 'test_mark',
};

const categoriesMock: Categories = {
  name: 'name categorie',
  comment: 'comment categorie',
  created_at: new Date(),
  productsId: ['1234567891234567'],
};

export const productEntityMock: Products = {
  productId: 'test',
  name: 'test',
  comment: 'test',
  price: 10.0,
  stock: 1,
  created_at: new Date(),
  updated_at: new Date(),
  reference: referenceMock,
  product_picture: [product_pictureMock],
  weight: 10.0,
  height: 11.0,
  width: 12.0,
  length: 13.0,
  ordersId: ['1234567891234567'],
  categories: [categoriesMock],
};

export const expectedProductEntityMock: any = {
  productId: 'test',
  name: 'test',
  comment: 'test',
  price: 10.0,
  stock: 1,
  reference: referenceMock,
  product_picture: [product_pictureMock],
  weight: 10.0,
  height: 11.0,
  width: 12.0,
  length: 13.0,
  categories: [categoriesMock],
  order: [],
};

export const createProductDtoMock: CreateProductDto = {
  name: 'test',
  comment: 'test',
  price: 10.0,
  stock: 1,
  reference: referenceMock,
  product_picture: [product_pictureMock],
  weight: 10.0,
  height: 11.0,
  width: 12.0,
  length: 13.0,
  ordersId: ['1234567891234567'],
  categories: [categoriesMock],
};
