import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersServiceMock } from './mocks/users.service.mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  createUserDtoMock,
  expectedUserEntityMock,
  updateUserDtoMock,
  updateUserPasswordDtoMock,
  userEntityMock,
} from './mocks/users.entity.mock';

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

  it('should be create user', async () => {
    const user = await controller.signup(createUserDtoMock);
    expect(user).toBeDefined();
    expect(user).toEqual(expectedUserEntityMock);
  });

  it('should be signin user', async () => {
    const user = await controller.signin(createUserDtoMock);
    expect(user).toBeDefined();
    expect(user).toEqual(expectedUserEntityMock);
  });

  it('should be get one user', async () => {
    const user = await controller.getProfil(userEntityMock.userId);
    expect(user).toBeDefined();
    expect(user).toEqual(expectedUserEntityMock);
  });

  it('should be update user', async () => {
    const user = await controller.update(
      updateUserDtoMock,
      userEntityMock.userId,
    );
    expect(user).toBeDefined();
    expect(user).toEqual(expectedUserEntityMock);
  });

  it('should be update password user', async () => {
    const user = await controller.updatePassword(
      updateUserPasswordDtoMock,
      userEntityMock.userId,
    );
    expect(user).toBeDefined();
    expect(user).toEqual('Le mot de passe a été modifié');
  });

  it('should be delete user', async () => {
    const user = await controller.delete(userEntityMock.userId);
    expect(user).toBeDefined();
    expect(user).toEqual("L'utilisateur a été supprimé");
  });

  it('should be can access to the route', () => {
    const result = controller.access();
    expect(result).toEqual('Vous etes Autorisé !');
  });
});
