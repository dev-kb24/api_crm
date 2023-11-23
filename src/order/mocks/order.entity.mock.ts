import { CreateOrderDto } from '@/order/dto/create-order.dto';
import { AddressEntity } from '@/order/entities/address.entity';
import { OrderEntity } from '@/order/entities/order.entity';
import { PicturesEntity } from '@/order/entities/pictures.entity';

const addressMock: AddressEntity = {
  street: 'street',
  city: 'city',
  zip: 'zip',
};

const picture_afterMock: PicturesEntity = {
  path: 'path',
  name: 'name',
  format: 'format',
  created_at: new Date(),
};

const picture_beforeMock: PicturesEntity = {
  path: 'path2',
  name: 'name2',
  format: 'format2',
  created_at: new Date(),
};

export const createOrderDtoMock: CreateOrderDto = {
  name: 'order name',
  comment: 'order description',
  authorId: '1234567891234567',
  usersId: ['1234567891234567'],
  productsId: ['1234567891234567'],
  address: addressMock,
  picture_after: picture_afterMock,
  picture_before: picture_beforeMock,
  started_at: new Date().toISOString(),
  finished_at: new Date().toISOString(),
};

export const orderEntityMock: OrderEntity = {
  orderId: '1234567891234567',
  name: 'order name',
  comment: 'order description',
  authorId: '1234567891234567',
  usersId: ['1234567891234567'],
  productsId: ['1234567891234567'],
  address: addressMock,
  picture_after: picture_afterMock,
  picture_before: picture_beforeMock,
  started_at: new Date(),
  finished_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
  users: [],
  products: [],
};

export const expectedOrderEntityMock: any = {
  name: 'order name',
  comment: 'order description',
  created_at: new Date(),
  updated_at: new Date(),
  started_at: new Date(),
  finished_at: new Date(),
  authorId: '1234567891234567',
  users: [],
  products: [],
  address: addressMock,
  picture_before: picture_beforeMock,
  picture_after: picture_afterMock,
};
