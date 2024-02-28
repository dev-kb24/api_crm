import { Pictures, Users } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';

const pictureMock: Pictures = {
  path: 'path',
  name: 'name',
  format: 'format',
  created_at: new Date(),
};

export const userEntityMock: Users = {
  userId: '1234567891234567',
  email: 'test@test.fr',
  password: 'password',
  civility: 1,
  firstname: 'firstname',
  lastname: 'lastname',
  fonction: 'test fonction',
  avatar: pictureMock,
  ordersId: ['1234567891234567'],
};

export const expectedUserEntityMock: any = {
  userId: '1234567891234567',
  email: 'test@test.fr',
  firstname: 'firstname',
  lastname: 'lastname',
};

export const createUserDtoMock: CreateUserDto = {
  email: 'test@test.fr',
  password: 'password',
  civility: 1,
  firstname: 'firstname',
  lastname: 'lastname',
  fonction: 'test fonction',
  avatar: pictureMock,
  ordersId: ['1234567891234567'],
};

export const updateUserDtoMock: CreateUserDto = {
  email: 'test@test.fr',
  password: 'password',
  civility: 1,
  firstname: 'firstname',
  lastname: 'lastname',
  fonction: 'test fonction',
  avatar: pictureMock,
  ordersId: ['1234567891234567'],
};

export const updateUserPasswordDtoMock: UpdateUserPasswordDto = {
  oldPassword: 'password',
  newPassword: 'newPassword',
};
