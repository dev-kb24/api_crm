import { CreateOrderDto } from '@/order/dto/create-order.dto';
import { AddressType } from '@/utils/types/address.type';
import { Address, Order, Pictures } from '@prisma/client';

const addressMock: Address = {
  name_address: 'address 1',
  street: 'street',
  city: 'city',
  zip: 'zip',
};

const picture_afterMock: Pictures = {
  path: 'path',
  name: 'name',
  format: 'format',
  created_at: new Date(),
};

const picture_beforeMock: Pictures = {
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
  address: addressMock as AddressType,
  picture_after: [picture_afterMock],
  picture_before: [picture_beforeMock],
  started_at: new Date().toISOString(),
  finished_at: new Date().toISOString(),
};

export const orderEntityMock: Order = {
  orderId: '1234567891234567',
  name: 'order name',
  comment: 'order description',
  authorId: '1234567891234567',
  usersId: ['1234567891234567'],
  productsId: ['1234567891234567'],
  address: addressMock,
  picture_after: [picture_afterMock],
  picture_before: [picture_beforeMock],
  started_at: new Date(),
  finished_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
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
