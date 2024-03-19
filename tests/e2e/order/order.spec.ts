import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { RepositoriesService } from '@/repositories/repositories.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

describe('Testing Order', () => {
  let orderId: string;
  const uuid: string = uuidv4();
  const userId: string = '65e730281eccd67c6e08e3ad';
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

  describe('create order', () => {
    it('/order (POST)', async () => {
      const order = {
        name: `e2e test - ${uuid}`,
        authorId: userId,
        address: {
          name_address: 'test name address',
          street: 'test',
          city: 'test',
          zip: '59000',
        },
      };
      const result = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(201);
      expect(result.body).toHaveProperty('orderId');
      expect(result.body).toHaveProperty('name', `e2e test - ${uuid}`);
      orderId = result.body.orderId;
    });

    it('/order (POST) - throw error', async () => {
      const order = {
        name: `e2e test - ${uuid}`,
        authorId: userId,
        address: {
          name_address: 'test name address',
          street: 'test',
          city: 'test',
          zip: '59000',
        },
      };
      const result = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('order name already exist');
    });

    it('/order (POST) - throw internal server error (findFirst)', async () => {
      const order = {
        name: `e2e test - ${uuid}-internal-server-error`,
        authorId: userId,
        address: {
          name_address: 'test name address',
          street: 'test',
          city: 'test',
          zip: '59000',
        },
      };
      jest.spyOn(repository.order, 'findFirst').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/order (POST) - throw internal server error (findFirst)', async () => {
      const order = {
        name: `e2e test - ${uuid}-bad-request-error`,
        authorId: userId,
        address: {
          name_address: 'test name address',
          street: 'test',
          city: 'test',
          zip: '59000',
        },
      };
      jest.spyOn(repository.order, 'findFirst').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(400);
      expect(result.badRequest).toEqual(true);
    });

    it('/order (POST) - throw internal server error (create)', async () => {
      const order = {
        name: `e2e test - ${uuid}-internal-server-error`,
        authorId: userId,
        address: {
          name_address: 'test name address',
          street: 'test',
          city: 'test',
          zip: '59000',
        },
      };
      jest.spyOn(repository.order, 'create').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/order (POST) - throw bad request error (create)', async () => {
      const order = {
        name: `e2e test - ${uuid}-bad-request-error`,
        authorId: userId,
        address: {
          name_address: 'test name address',
          street: 'test',
          city: 'test',
          zip: '59000',
        },
      };
      jest.spyOn(repository.order, 'create').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(400);
      expect(result.badRequest).toEqual(true);
    });

    it('/order (POST) - throw Unauthorized (fake token)', async () => {
      const order = {
        name: `e2e test - ${uuid}-bad-request-error`,
        authorId: userId,
        address: {
          name_address: 'test name address',
          street: 'test',
          city: 'test',
          zip: '59000',
        },
      };
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .post('/order')
        .set('Authorization', `Bearer ${fakeToken}`)
        .send(order);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/order (POST) - throw Unauthorized (fake token)', async () => {
      const order = {
        name: `e2e test - ${uuid}-bad-request-error`,
        authorId: userId,
        address: {
          name_address: 'test name address',
          street: 'test',
          city: 'test',
          zip: '59000',
        },
      };
      const result = await request(app.getHttpServer())
        .post('/order')
        .send(order);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('find order', () => {
    it('/order (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get('/order')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
    });

    it('/order (GET) - throw internal server error (findMany)', async () => {
      jest.spyOn(repository.order, 'findMany').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .get('/order')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/order (GET) - throw bad request error (findMany)', async () => {
      jest.spyOn(repository.order, 'findMany').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .get('/order')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(400);
      expect(result.badRequest).toEqual(true);
    });

    it('/order (GET) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'kafe_token';
      const result = await request(app.getHttpServer())
        .get('/order')
        .set('Authorization', `Bearer ${fakeToken}`);

      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/order (GET) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer()).get('/order');

      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/order/:id (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('orderId');
      expect(result.body).toHaveProperty('name', `e2e test - ${uuid}`);
    });

    it('/order/:id (GET) - throw error', async () => {
      const idOrderFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .get(`/order/${idOrderFake}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(`OrderId : ${idOrderFake} not found`);
    });

    it('/order/:id (GET) - throw badRequest error (findUnique)', async () => {
      jest.spyOn(repository.order, 'findUnique').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .get(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(400);
      expect(result.badRequest).toEqual(true);
    });

    it('/order/:id (GET) - throw internal server error (findUnique)', async () => {
      jest.spyOn(repository.order, 'findUnique').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .get(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/order/:id (GET) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .get(`/order/${orderId}`)
        .set('Authorization', `Bearer ${fakeToken}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/order/:id (GET) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer()).get(
        `/order/${orderId}`,
      );
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('update order', () => {
    it('/order/:id (PUT)', async () => {
      const order = {
        name: 'e2e test update',
        productsId: [],
        usersId: [],
      };
      const result = await request(app.getHttpServer())
        .put(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('orderId');
      expect(result.body).toHaveProperty('name', 'e2e test update');
    });

    it('/order/:id (PUT) - throw error bad request, fake orderId', async () => {
      const fakeOrderId = '123456789';
      const order = {
        name: 'e2e test update',
        productsId: [],
        usersId: [],
      };
      const result = await request(app.getHttpServer())
        .put(`/order/${fakeOrderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(400);
      expect(result.badRequest).toEqual(true);
    });

    it('/order/:id (PUT) - throw error bad request (update)', async () => {
      jest.spyOn(repository.order, 'update').mockRejectedValue(errorKnow);
      const order = {
        name: 'e2e test update',
        productsId: [],
        usersId: [],
      };
      const result = await request(app.getHttpServer())
        .put(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(400);
      expect(result.badRequest).toEqual(true);
    });

    it('/order/:id (PUT) - throw error internal server (update)', async () => {
      jest.spyOn(repository.order, 'update').mockRejectedValue(errorUnknow);
      const order = {
        name: 'e2e test update',
        productsId: [],
        usersId: [],
      };
      const result = await request(app.getHttpServer())
        .put(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/order/:id (PUT) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const order = {
        name: 'e2e test update',
        productsId: [],
        usersId: [],
      };
      const result = await request(app.getHttpServer())
        .put(`/order/${orderId}`)
        .set('Authorization', `Bearer ${fakeToken}`)
        .send(order);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/order/:id (PUT) - throw Unauthorized (empty authorization)', async () => {
      const order = {
        name: 'e2e test update',
        productsId: [],
        usersId: [],
      };
      const result = await request(app.getHttpServer())
        .put(`/order/${orderId}`)
        .send(order);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('delete order', () => {
    it('/order/:id (DELETE)', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.text).toEqual('Le devis à été supprimé');
    });

    it('/order/:id (DELETE) - throw bad request error, fake orderId', async () => {
      const fakeOrderId = '123456789';
      const result = await request(app.getHttpServer())
        .delete(`/order/${fakeOrderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(400);
      expect(result.badRequest).toEqual(true);
    });

    it('/order/:id (DELETE) - throw bad request error, (delete)', async () => {
      jest.spyOn(repository.order, 'delete').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .delete(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(400);
      expect(result.badRequest).toEqual(true);
    });

    it('/order/:id (DELETE) - throw internal server error, (delete)', async () => {
      jest.spyOn(repository.order, 'delete').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .delete(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/order/:id (DELETE) - throw Unauthorized error, fake token', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .delete(`/order/${orderId}`)
        .set('Authorization', `Bearer ${fakeToken}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/order/:id (DELETE) - throw Unauthorized error, empty Authorization', async () => {
      const result = await request(app.getHttpServer()).delete(
        `/order/${orderId}`,
      );
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });
});
