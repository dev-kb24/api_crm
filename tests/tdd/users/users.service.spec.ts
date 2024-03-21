/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/users/users.service';
import { RepositoriesService } from '@/repositories/repositories.service';
import { RepositoriesServiceMock } from '@/repositories/mocks/repositories.service.mock';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/mailer/mail.service';
import { MailServiceMock } from '@/mailer/mocks/mail.service.mock';
import {
  signupUserDtoMock,
  signinUserDtoMock,
  updateUserDtoMock,
  updateUserPasswordDtoMock,
  userEntityMock,
} from '../../../src/users/mocks/users.entity.mock';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtServiceMock } from '../../../src/users/mocks/jwt.service.mock';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

describe('UsersService', () => {
  let service: UsersService;
  const errorKnow = new PrismaClientKnownRequestError('BadRequest error', {
    clientVersion: 'test client version',
    code: 'test code',
  });
  const errorUnKnow = new PrismaClientUnknownRequestError(
    'internal server error',
    {
      clientVersion: 'client test version',
    },
  );
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: MailService, useClass: MailServiceMock },
        { provide: JwtService, useClass: jwtServiceMock },
        ConfigService,
        { provide: RepositoriesService, useClass: RepositoriesServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('signup user', () => {
    it('should create user', async () => {
      service['repositoriesService']['users']['findFirst'] = jest
        .fn()
        .mockResolvedValue(undefined);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('password' as never);
      const user = await service.signup(signupUserDtoMock);
      expect(user).toBeDefined();
      expect(user).toEqual(userEntityMock);
    });

    it('should return error if user exist', async () => {
      try {
        await service.signup(signupUserDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('User already exist');
      }
    });

    it('Should return an error if the create function returns an error. (create 500)', async () => {
      try {
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockResolvedValue(undefined);
        service['repositoriesService']['users']['create'] = jest
          .fn()
          .mockRejectedValue(errorUnKnow);
        await service.signup(signupUserDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('Should return an error if the create function returns an error. (create 400)', async () => {
      try {
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockResolvedValue(undefined);
        service['repositoriesService']['users']['create'] = jest
          .fn()
          .mockRejectedValue(errorKnow);
        await service.signup(signupUserDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('BadRequest error');
      }
    });

    it('should return error if hashPassword throw error', async () => {
      try {
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockResolvedValue(undefined);
        jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
        jest.spyOn(bcrypt, 'hash').mockRejectedValue('error' as never);
        await service.signup(signupUserDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Erreur lors du hashage error');
      }
    });
  });

  describe('signin user', () => {
    it('should signin user', async () => {
      service['repositoriesService']['users']['findFirst'] = jest
        .fn()
        .mockResolvedValue(userEntityMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      const user = await service.signin(signinUserDtoMock);
      expect(user).toBeDefined();
      expect(user.access_token).toEqual('token');
      expect(user.user).toEqual(userEntityMock);
    });

    it('should return error if user not exist', async () => {
      try {
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockResolvedValue(undefined);
        await service.signin(signinUserDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('User not found');
      }
    });

    it('should return an error if the user is invalid', async () => {
      try {
        userEntityMock.user_is_valid = false;
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockResolvedValue(userEntityMock);
        await service.signin(signinUserDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual("Votre compte n'a pas été validé");
      }
    });

    it('should return error if password is wrong', async () => {
      try {
        userEntityMock.user_is_valid = true;
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockResolvedValue(userEntityMock);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
        await service.signin(signinUserDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('Le mot de passe est incorrect');
      }
    });
  });

  describe('update password', () => {
    it('should update password', async () => {
      service['repositoriesService']['users']['findFirst'] = jest
        .fn()
        .mockResolvedValue(userEntityMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('password' as never);
      const user = await service.updatePassword(
        { oldPassword: 'password', newPassword: 'password2' },
        userEntityMock.userId,
      );
      expect(user).toBeDefined();
      expect(user).toEqual(userEntityMock);
    });

    it('should return error if updatePassword throw error', async () => {
      try {
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockResolvedValue(userEntityMock);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
        await service.updatePassword(
          updateUserPasswordDtoMock,
          userEntityMock.userId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Le mot de passe est incorrect');
      }
    });
  });

  describe('update user and validation email', () => {
    it('should update user', async () => {
      const user = await service.update(
        updateUserDtoMock,
        userEntityMock.userId,
      );
      expect(user).toEqual(userEntityMock);
    });

    it('should Validate user', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      service.findById = jest.fn().mockResolvedValue(userEntityMock);
      const isValid = await service.validation('12', '1234567891234567');
      expect(isValid).toEqual(true);
    });

    it('should return a badRequestException', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      service.findById = jest.fn().mockResolvedValue(userEntityMock);
      try {
        await service.validation('1245', '1234567891234567');
      } catch (error) {
        expect(error.message).toEqual(
          "Votre code de confirmation n'est pas le bon",
        );
      }
    });

    it('Should return an error if the update function returns an error. (update 500)', async () => {
      try {
        service['repositoriesService']['users']['update'] = jest
          .fn()
          .mockRejectedValue(errorUnKnow);
        await service.updateUser({ userId: '123456' }, { test: 'test' });
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
      }
    });

    it('Should return an error if the update function returns an error. (update 400)', async () => {
      try {
        service['repositoriesService']['users']['update'] = jest
          .fn()
          .mockRejectedValue(errorKnow);
        await service.updateUser({ userId: '123456' }, { test: 'test' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(`BadRequest error`);
      }
    });
  });

  describe('find user', () => {
    it('should return an error if findById return undefined', async () => {
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

    it('sould get user by id', async () => {
      const user = await service.getProfil(userEntityMock.userId);
      expect(user).toEqual(userEntityMock);
    });

    it('Should return an error if the findfirst function returns an error. (findFirst 500)', async () => {
      try {
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockRejectedValue(errorUnKnow);
        await service.findByEmail('test@test.fr');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(`internal server error`);
      }
    });

    it('Should return an error if the findfirst function returns an error. (findFirst 400)', async () => {
      try {
        service['repositoriesService']['users']['findFirst'] = jest
          .fn()
          .mockRejectedValue(errorKnow);
        await service.findByEmail('test@test.fr');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(`BadRequest error`);
      }
    });
    it('Should return an error if the findUnique function returns an error. (findUnique 500)', async () => {
      try {
        service['repositoriesService']['users']['findUnique'] = jest
          .fn()
          .mockRejectedValue(errorUnKnow);
        await service.findById('123456789');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(`internal server error`);
      }
    });

    it('Should return an error if the findUnique function returns an error. (findUnique 400)', async () => {
      try {
        service['repositoriesService']['users']['findUnique'] = jest
          .fn()
          .mockRejectedValue(errorKnow);
        await service.findById('123456789');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(`BadRequest error`);
      }
    });
  });

  describe('delete user', () => {
    it('should delete user', async () => {
      const user = await service.delete(userEntityMock.userId);
      expect(user).toEqual(userEntityMock);
    });

    it('Should return an error if the delete function returns an error. (delete 500)', async () => {
      try {
        service['repositoriesService']['users']['delete'] = jest
          .fn()
          .mockRejectedValue(errorUnKnow);
        await service.delete(userEntityMock.userId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(`internal server error`);
      }
    });

    it('Should return an error if the delete function returns an error. (delete 400)', async () => {
      try {
        service['repositoriesService']['users']['delete'] = jest
          .fn()
          .mockRejectedValue(errorKnow);
        await service.delete(userEntityMock.userId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(`BadRequest error`);
      }
    });
  });

  describe('forgot password', () => {
    it('should be send an email', async () => {
      const user = await service.forgot('test@test.fr');
      expect(user).toEqual(userEntityMock);
    });

    it('should return an error (notfound error)', async () => {
      service['repositoriesService']['users']['findFirst'] = jest
        .fn()
        .mockResolvedValue(null);
      try {
        await service.forgot('test@test.fr');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`email not found`);
      }
    });
  });
});
