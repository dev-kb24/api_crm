import { SigninUserDto } from '../dto/signin-user.dto';
import { SignupUserDto } from '../dto/signup-user.dto';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';
import { UserEntity } from '../entity/userEntity';

export const userEntityMock: UserEntity = {
  userId: '1234567891234567',
  email: 'test@test.fr',
  password: 'password',
  firstname: 'firstname',
  lastname: 'lastname',
};

export const expectedUserEntityMock: any = {
  userId: '1234567891234567',
  email: 'test@test.fr',
  firstname: 'firstname',
  lastname: 'lastname',
};

export const signupUserDtoMock: SignupUserDto = {
  email: 'test@test.fr',
  password: 'password',
  firstname: 'firstname',
  lastname: 'lastname',
};

export const signinUserDtoMock: SigninUserDto = {
  email: 'test@test.fr',
  password: 'password',
};

export const updateUserDtoMock: SignupUserDto = {
  email: 'test@test.fr',
  password: 'password',
  firstname: 'firstname',
  lastname: 'lastname',
};

export const updateUserPasswordDtoMock: UpdateUserPasswordDto = {
  oldPassword: 'password',
  newPassword: 'newPassword',
};
