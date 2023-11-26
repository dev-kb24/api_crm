import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { RepositoriesService } from '@/repositories/repositories.service';
import { RepositoriesServiceMock } from '@/repositories/mocks/repositories.service.mock';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/mailer/mail.service';
import { MailServiceMock } from '@/mailer/mocks/mail.service.mock';
import { createUserDtoMock, updateUserDtoMock, updateUserPasswordDtoMock, userEntityMock } from './mocks/users.entity.mock';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtServiceMock } from './mocks/jwt.service.mock';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,{provide:MailService,useClass:MailServiceMock},{provide:JwtService,useClass:jwtServiceMock},ConfigService,{ provide: RepositoriesService, useClass: RepositoriesServiceMock }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be create user', async () => {
    service['repositoriesService']['users']['findFirst'] = jest
      .fn()
      .mockResolvedValue(undefined);
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('password' as never);
    const user = await service.signup(createUserDtoMock);
    expect(user).toBeDefined();
    expect(user).toEqual(userEntityMock);
  });

  it('should be signin user', async () => {
    service['repositoriesService']['users']['findFirst'] = jest
      .fn()
      .mockResolvedValue(userEntityMock);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const user = await service.signin(createUserDtoMock);
    expect(user).toBeDefined();
    expect(user).toEqual({access_token: 'token',user:userEntityMock});
  });

  it('should be throw error if user exist', async () => {
    try {
      await service.signup(createUserDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual('User already exist');
    }
  });

  it('should be throw error if user not exist', async () => {
    try {
      service['repositoriesService']['users']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      await service.signin(createUserDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('User not found');
    }
  });

  it('should be throw error if password is wrong', async () => {
    try {
      service['repositoriesService']['users']['findFirst'] = jest
        .fn()
        .mockResolvedValue(userEntityMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      await service.signin(createUserDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual('Le mot de passe est incorrect');
    }
  });

  it('should be throw error if hashPassword throw error', async () => {
    try {
      service['repositoriesService']['users']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockRejectedValue('error' as never);
      await service.signup(createUserDtoMock);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual('Erreur lors du hashage du password error');
    }
  });

  it('should be throw error if updatePassword throw error', async () => {
    try {
      service['repositoriesService']['users']['findFirst'] = jest
        .fn()
        .mockResolvedValue(userEntityMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      await service.updatePassword(updateUserPasswordDtoMock,userEntityMock.userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual('Le mot de passe est incorrect');
    }
  });

  it('should be update password', async () => {
    service['repositoriesService']['users']['findFirst'] = jest
      .fn()
      .mockResolvedValue(userEntityMock);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('password' as never);
    const user = await service.updatePassword({oldPassword:'password',newPassword:'password2'},userEntityMock.userId);
    expect(user).toBeDefined();
    expect(user).toEqual(userEntityMock);
  });

  it('should be update user', async () => {
    const user = await service.update(
      updateUserDtoMock,
      userEntityMock.userId
    );
    expect(user).toEqual(userEntityMock);
  });

  it('should be throw error if findById return undefined', async () => {
    try {
      service['repositoriesService']['users']['findUnique'] = jest
        .fn()
        .mockResolvedValue(undefined);
      await service.findById(userEntityMock.userId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual(
        `UserId : ${userEntityMock.userId} not found`,
      );
    }
  });

  it('sould be get user by id', async () => {
    const user = await service.getProfil(userEntityMock.userId);
    expect(user).toEqual(userEntityMock);
  });

  it('should be delete user', async () => {
    const user = await service.delete(userEntityMock.userId);
    expect(user).toEqual(userEntityMock);
  });

  
});
