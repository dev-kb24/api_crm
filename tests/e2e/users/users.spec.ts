import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import * as bcrypt from 'bcrypt';
import { RepositoriesService } from '../../../src/repositories/repositories.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

describe('Testing Users', () => {
  let userId: string;
  let app: INestApplication;
  let token: string;
  let repository: RepositoriesService;
  const errorUnknow = new PrismaClientUnknownRequestError(
    'internal server error',
    {
      clientVersion: 'client version test',
    },
  );
  const errorKnow = new PrismaClientKnownRequestError('Error badRequest', {
    clientVersion: 'client version test',
    code: 'test code',
  });
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const result = await request(app.getHttpServer())
      .post('/users/signin')
      .send({ email: 'admin@admin.fr', password: 'Admin@123' });
    token = result.body.access_token;

    repository = moduleFixture.get<RepositoriesService>(RepositoriesService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('signup user', () => {
    it('/users/signup (POST)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `Test@123`,
        firstname: `test`,
        lastname: `test`,
        code_email: '1001',
      };
      const result = await request(app.getHttpServer())
        .post('/users/signup')
        .send(user);
      expect(result.status).toEqual(201);
      expect(result.body).toHaveProperty('userId');
      expect(result.body).toHaveProperty('email', user.email);
      userId = result.body.userId;
    });

    it('/users/signup (POST) - throw error (hashage)', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('test' as never);
      jest.spyOn(bcrypt, 'hash').mockRejectedValue('test' as never);

      const user = {
        email: `test@test2.fr`,
        password: `Test@123`,
        firstname: `test`,
        lastname: `test`,
        code_email: '1001',
      };
      const result = await request(app.getHttpServer())
        .post('/users/signup')
        .send(user);
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('Erreur lors du hashage test');
    });

    it('/users/signup (POST) - throw error (exist)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `Test@123`,
        firstname: `test`,
        lastname: `test`,
        code_email: '1001',
      };
      const result = await request(app.getHttpServer())
        .post('/users/signup')
        .send(user);
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('User already exist');
    });

    it('/users/signup (POST) - throw error (internalServer)', async () => {
      const user = {
        email: 'test2@test.fr',
        password: `Test@123`,
        firstname: `test`,
        lastname: `test`,
        code_email: '1001',
      };
      jest.spyOn(repository.users, 'create').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .post('/users/signup')
        .send(user);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/users/signup (POST) - throw error (badRequest)', async () => {
      const user = {
        email: 'test2@test.fr',
        password: `Test@123`,
        firstname: `test`,
        lastname: `test`,
        code_email: '1001',
      };
      jest.spyOn(repository.users, 'create').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .post('/users/signup')
        .send(user);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });
  });

  describe('try signin user', () => {
    it('/users/signin (POST) - throw error (user is invalid)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `Test@123`,
      };
      const result = await request(app.getHttpServer())
        .post('/users/signin')
        .send(user);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual("Votre compte n'a pas été validé");
    });
  });

  describe('validation user', () => {
    it('/users/validation/:id (Validation Mail)', async () => {
      const send = {
        code_email: '1001',
      };
      const result = await request(app.getHttpServer())
        .put(`/users/validation/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(send);
      expect(result.status).toEqual(200);
      expect(result.text).toEqual('Votre compte est validé');
    });

    it('/users/validation/:id (Validation Mail) -  throw error (bad request)', async () => {
      const send = {
        code_email: '1002',
      };
      const result = await request(app.getHttpServer())
        .put(`/users/validation/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(send);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual(
        "Votre code de confirmation n'est pas le bon",
      );
    });

    it('/users/validation/:id (Validation Mail) -  throw error (internal server)', async () => {
      const send = {
        code_email: '1001',
      };
      jest.spyOn(repository.users, 'update').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .put(`/users/validation/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(send);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/users/validation/:id (Validation Mail) -  throw error (badRequest)', async () => {
      const send = {
        code_email: '1001',
      };
      jest.spyOn(repository.users, 'update').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .put(`/users/validation/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(send);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });
  });

  describe('signin user', () => {
    it('/users/signin (POST)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `Test@123`,
      };
      const result = await request(app.getHttpServer())
        .post('/users/signin')
        .send(user);
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('access_token');
      expect(result.body).toHaveProperty('user');
    });

    it('/users/signin (POST) - throw error (user not found)', async () => {
      const user = {
        email: `test@test3.fr`,
        password: `Test@123`,
      };
      const result = await request(app.getHttpServer())
        .post('/users/signin')
        .send(user);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual('User not found');
    });

    it('/users/signin (POST) - throw error (password incorrect)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `Test@1234`,
      };
      const result = await request(app.getHttpServer())
        .post('/users/signin')
        .send(user);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Le mot de passe est incorrect');
    });

    it('/users/signin (POST) - throw error (internal server)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `Test@123`,
      };
      jest.spyOn(repository.users, 'findFirst').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .post('/users/signin')
        .send(user);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/users/signin (POST) - throw error (badRequest)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `Test@123`,
      };
      jest.spyOn(repository.users, 'findFirst').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .post('/users/signin')
        .send(user);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });
  });

  describe('find user', () => {
    it('/users/getProfil/:id (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get(`/users/getProfil/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('userId');
    });

    it('/users/getProfil/:id (GET) - throw error (not found)', async () => {
      const idUserFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .get(`/users/getProfil/${idUserFake}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(`UserId : ${idUserFake} not found`);
    });

    it('/users/getProfil/:id (GET) - throw error (internal server)', async () => {
      jest.spyOn(repository.users, 'findUnique').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .get(`/users/getProfil/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/users/getProfil/:id (GET) - throw error (badRequest)', async () => {
      jest.spyOn(repository.users, 'findUnique').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .get(`/users/getProfil/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/users/getProfil/:id (GET) - throw error fake token (Unauthorized)', async () => {
      const tokenFake = 'test_token';
      const result = await request(app.getHttpServer())
        .get(`/users/getProfil/${userId}`)
        .set('Authorization', `Bearer ${tokenFake}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/users/getProfil/:id (GET) - throw error empty Authorization (Unauthorized)', async () => {
      const result = await request(app.getHttpServer()).get(
        `/users/getProfil/${userId}`,
      );
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('update user', () => {
    it('/users/password/:id (PUT)', async () => {
      const updatepassword = {
        oldPassword: `Test@123`,
        newPassword: `Test@456`,
      };
      const result = await request(app.getHttpServer())
        .put(`/users/password/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatepassword);
      expect(result.status).toEqual(200);
      expect(result.text).toEqual('Le mot de passe a été modifié');
    });

    it('/users/password/:id (PUT) - throw error (password incorrect)', async () => {
      const updatepassword = {
        oldPassword: `test_2`,
        newPassword: `Test@456`,
      };
      const result = await request(app.getHttpServer())
        .put(`/users/password/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatepassword);
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('Le mot de passe est incorrect');
    });

    it('/users/password/:id (PUT) - throw error (internal server)', async () => {
      const updatepassword = {
        oldPassword: `Test@456`,
        newPassword: `Test@123`,
      };
      jest.spyOn(repository.users, 'update').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .put(`/users/password/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatepassword);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/users/password/:id (PUT) - throw error (badRequest)', async () => {
      const updatepassword = {
        oldPassword: `Test@456`,
        newPassword: `Test@123`,
      };
      jest.spyOn(repository.users, 'update').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .put(`/users/password/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatepassword);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/users/password/:id (PUT) - throw error fake token (Unauthorized)', async () => {
      const updatepassword = {
        oldPassword: `Test@456`,
        newPassword: `Test@123`,
      };
      const tokenFake = 'test_token';
      const result = await request(app.getHttpServer())
        .put(`/users/password/${userId}`)
        .set('Authorization', `Bearer ${tokenFake}`)
        .send(updatepassword);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/users/password/:id (PUT) - throw error empty Authorization (Unauthorized)', async () => {
      const updatepassword = {
        oldPassword: `Test@456`,
        newPassword: `Test@123`,
      };
      const result = await request(app.getHttpServer())
        .put(`/users/password/${userId}`)
        .send(updatepassword);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/users/:id (PUT)', async () => {
      const user = {
        email: 'test@test.fr',
        firstname: 'test_1',
        lastname: 'test_1',
      };
      const result = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(user);
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('userId');
      expect(result.body).toHaveProperty('email', user.email);
      expect(result.body).toHaveProperty('firstname', user.firstname);
      expect(result.body).toHaveProperty('lastname', user.lastname);
    });

    it('/users/:id (PUT) - throw error (not found)', async () => {
      const user = {
        email: 'test@test.fr',
        firstname: 'test_1',
        lastname: 'test_1',
      };
      const idUserFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .put(`/users/${idUserFake}`)
        .set('Authorization', `Bearer ${token}`)
        .send(user);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(`UserId : ${idUserFake} not found`);
    });

    it('/users/:id (PUT) - throw error (internal server)', async () => {
      const user = {
        email: 'test@test.fr',
        firstname: 'test_1',
        lastname: 'test_1',
      };
      jest.spyOn(repository.users, 'update').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(user);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/users/:id (PUT) - throw error (badRequest)', async () => {
      const user = {
        email: 'test@test.fr',
        firstname: 'test_1',
        lastname: 'test_1',
      };
      jest.spyOn(repository.users, 'update').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(user);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/users/:id (PUT) - throw error fake token (Unauthorized)', async () => {
      const user = {
        email: 'test@test.fr',
        firstname: 'test_1',
        lastname: 'test_1',
      };
      const tokenFake = 'test_token';
      const result = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${tokenFake}`)
        .send(user);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/users/:id (PUT) - throw error empty Authorization (Unauthorized)', async () => {
      const user = {
        email: 'test@test.fr',
        firstname: 'test_1',
        lastname: 'test_1',
      };
      const result = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(user);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('access user', () => {
    it('/users/access (Access user)', async () => {
      const result = await request(app.getHttpServer())
        .get(`/users/access/`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('userId');
    });

    it('/users/access (Access user) - throw error fake token (Unauthorized)', async () => {
      const tokenFake = 'test_token';
      const result = await request(app.getHttpServer())
        .get(`/users/access/`)
        .set('Authorization', `Bearer ${tokenFake}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/users/access (Access user) - throw error empty authorization (Unauthorized)', async () => {
      const result = await request(app.getHttpServer()).get(`/users/access/`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('forgot email', () => {
    it('/users/forgot (forgotten email)', async () => {
      const result = await request(app.getHttpServer())
        .post(`/users/forgot/`)
        .send({ email: 'test@test.fr' });
      expect(result.status).toEqual(200);
      expect(result.text).toEqual('Un email à été envoyé!');
    });

    it('/users/forgot (forgotten email) - throw error not found email', async () => {
      const result = await request(app.getHttpServer())
        .post(`/users/forgot/`)
        .send({ email: 'test2@test.fr' });
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual('email not found');
    });

    it('/users/forgot (forgotten email) - throw error (internal server)', async () => {
      jest.spyOn(repository.users, 'findFirst').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .post(`/users/forgot/`)
        .send({ email: 'test@test.fr' });
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/users/forgot (forgotten email) - throw error (badRequest)', async () => {
      jest.spyOn(repository.users, 'findFirst').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .post(`/users/forgot/`)
        .send({ email: 'test@test.fr' });
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });
  });

  describe('delete user', () => {
    it('/users/:id (DELETE) - throw error (not found)', async () => {
      const idUserFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .delete(`/users/${idUserFake}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(`UserId : ${idUserFake} not found`);
    });

    it('/users/:id (DELETE) - throw error (internal server)', async () => {
      jest.spyOn(repository.users, 'delete').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/users/:id (DELETE) - throw error (badRequest)', async () => {
      jest.spyOn(repository.users, 'delete').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/users/:id (DELETE) - throw error fake token (Unauthorized)', async () => {
      const tokenFake = 'test_token';
      const result = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${tokenFake}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/users/:id (DELETE) - throw error empty authorization (Unauthorized)', async () => {
      const result = await request(app.getHttpServer()).delete(
        `/users/${userId}`,
      );
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/users/:id (DELETE)', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.text).toEqual("L'utilisateur a été supprimé");
    });
  });
});
