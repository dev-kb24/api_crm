import { SigninUserDto } from '../dto/signin-user.dto';
import { SignupUserDto } from '../dto/signup-user.dto';
import { Pictures, Users } from '@prisma/client';
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
  code_email: '12',
  user_is_valid: false,
  avatar: pictureMock,
  ordersId: ['1234567891234567'],
};

export const expectedUserEntityMock: any = {
  userId: '1234567891234567',
  email: 'test@test.fr',
  firstname: 'firstname',
  lastname: 'lastname',
  code_email: 1234,
};

export const signupUserDtoMock: SignupUserDto = {
  email: 'test@test.fr',
  password: 'password',
  civility: 1,
  firstname: 'firstname',
  lastname: 'lastname',
  fonction: 'test fonction',
  code_email: '12',
  avatar: pictureMock,
  ordersId: ['1234567891234567'],
};

export const signinUserDtoMock: SigninUserDto = {
  email: 'test@test.fr',
  password: 'password',
};

export const updateUserDtoMock: SignupUserDto = {
  email: 'test@test.fr',
  password: 'password',
  civility: 1,
  firstname: 'firstname',
  lastname: 'lastname',
  code_email: '12',
  fonction: 'test fonction',
  avatar: pictureMock,
  ordersId: ['1234567891234567'],
};

export const updateUserPasswordDtoMock: UpdateUserPasswordDto = {
  oldPassword: 'password',
  newPassword: 'newPassword',
};
