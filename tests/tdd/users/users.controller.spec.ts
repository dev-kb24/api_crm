/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/users/users.controller';
import { UsersService } from '../../../src/users/users.service';
import { UsersServiceMock } from '../../../src/users/mocks/users.service.mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  signupUserDtoMock,
  signinUserDtoMock,
  expectedUserEntityMock,
  updateUserDtoMock,
  updateUserPasswordDtoMock,
  userEntityMock,
} from '../../../src/users/mocks/users.entity.mock';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        JwtService,
        ConfigService,
        { provide: UsersService, useClass: UsersServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should create user', async () => {
    const user = await controller.signup(signupUserDtoMock);
    expect(user).toBeDefined();
    expect(user).toEqual(expectedUserEntityMock);
  });

  it('should signin user', async () => {
    const user = await controller.signin(signinUserDtoMock);
    expect(user).toBeDefined();
    expect(user).toEqual(expectedUserEntityMock);
  });

  it('should get one user', async () => {
    const user = await controller.getProfil(userEntityMock.userId);
    expect(user).toBeDefined();
    expect(user).toEqual(expectedUserEntityMock);
  });

  it('should update user', async () => {
    const user = await controller.update(
      updateUserDtoMock,
      userEntityMock.userId,
    );
    expect(user).toBeDefined();
    expect(user).toEqual(expectedUserEntityMock);
  });

  it('should update password user', async () => {
    const user = await controller.updatePassword(
      updateUserPasswordDtoMock,
      userEntityMock.userId,
    );
    expect(user).toBeDefined();
    expect(user).toEqual('Le mot de passe a été modifié');
  });

  it('should delete user', async () => {
    const user = await controller.delete(userEntityMock.userId);
    expect(user).toBeDefined();
    expect(user).toEqual("L'utilisateur a été supprimé");
  });

  it('should can access to the route', () => {
    const result = controller.access();
    expect(result).toEqual('Vous etes Autorisé !');
  });

  it('should can valide user', async () => {
    const result = await controller.validation("1234", '1234567891234567');
    expect(result).toEqual('Votre compte est validé');
  });
});
