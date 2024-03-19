import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { RepositoriesService } from '../../../src/repositories/repositories.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

describe('Testing Suppliers', () => {
  let suppliersId: string;
  const uuid: string = uuidv4();
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

  describe('create suppliers', () => {
    it('/suppliers (POST)', async () => {
      const result = await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: `e2e test - ${uuid}` });
      expect(result.status).toEqual(201);
      expect(result.body).toHaveProperty('suppliersId');
      expect(result.body).toHaveProperty('raisonSocial', `e2e test - ${uuid}`);
      suppliersId = result.body.suppliersId;
    });

    it('/suppliers (POST) - throw error', async () => {
      const result = await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: `e2e test - ${uuid}` });
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('supplier already exist');
    });

    it('/suppliers (POST) - throw internal server error', async () => {
      jest.spyOn(repository.suppliers, 'create').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: `e2e test - ${uuid}-internal-server-error` });
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/suppliers (POST) - throw Error badRequest', async () => {
      jest.spyOn(repository.suppliers, 'create').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: `e2e test - ${uuid}-internal-server-error` });
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/suppliers (POST) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ raisonSocial: `e2e test - ${uuid}` });
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/suppliers (POST) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer())
        .post('/suppliers')
        .send({ raisonSocial: `e2e test - ${uuid}` });
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('find suppliers', () => {
    it('/suppliers (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get('/suppliers')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
    });

    it('/suppliers (GET) - throw internal error', async () => {
      jest
        .spyOn(repository.suppliers, 'findMany')
        .mockRejectedValue(errorUnknow);

      const result = await request(app.getHttpServer())
        .get('/suppliers')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/suppliers (GET) - throw Error badRequest', async () => {
      jest.spyOn(repository.suppliers, 'findMany').mockRejectedValue(errorKnow);

      const result = await request(app.getHttpServer())
        .get('/suppliers')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/suppliers (GET) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'test_token';
      const result = await request(app.getHttpServer())
        .get('/suppliers')
        .set('Authorization', `Bearer ${fakeToken}`);

      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/suppliers (GET) - throw Unauthorized (empty authorization)', async () => {
      const result = await request(app.getHttpServer()).get('/suppliers');

      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/suppliers/:id (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('suppliersId');
      expect(result.body).toHaveProperty('raisonSocial', `e2e test - ${uuid}`);
    });

    it('/suppliers/:id (GET) - throw error', async () => {
      const idSupplierFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .get(`/suppliers/${idSupplierFake}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(
        `SupplierId : ${idSupplierFake} not found`,
      );
    });

    it('/suppliers/:id (GET) - throw internal server error', async () => {
      jest
        .spyOn(repository.suppliers, 'findUnique')
        .mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .get(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/suppliers/:id (GET) - throw Error badRequest', async () => {
      jest
        .spyOn(repository.suppliers, 'findUnique')
        .mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .get(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/suppliers/:id (GET) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .get(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${fakeToken}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/suppliers/:id (GET) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer()).get(
        `/suppliers/${suppliersId}`,
      );
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('update suppliers', () => {
    it('/suppliers/:id (PUT)', async () => {
      const result = await request(app.getHttpServer())
        .put(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: 'e2e test update' });
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('suppliersId');
      expect(result.body).toHaveProperty('raisonSocial', 'e2e test update');
    });

    it('/suppliers/:id (PUT) - throw error not found', async () => {
      const idSupplierFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .put(`/suppliers/${idSupplierFake}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: 'e2e test update' });
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(
        `SupplierId : ${idSupplierFake} not found`,
      );
    });

    it('/suppliers/:id (PUT) - throw internal server error', async () => {
      jest.spyOn(repository.suppliers, 'update').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .put(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: 'e2e test update' });
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/suppliers/:id (PUT) - throw Error badRequest', async () => {
      jest.spyOn(repository.suppliers, 'update').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .put(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: 'e2e test update' });
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/suppliers/:id (PUT) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .put(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ raisonSocial: 'e2e test update' });
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/suppliers/:id (PUT) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer())
        .put(`/suppliers/${suppliersId}`)
        .send({ raisonSocial: 'e2e test update' });
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('delete suppliers', () => {
    it('/suppliers/:id (DELETE) - throw error not found', async () => {
      const idSupplierFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .delete(`/suppliers/${idSupplierFake}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(
        `SupplierId : ${idSupplierFake} not found`,
      );
    });

    it('/suppliers/:id (DELETE) - throw internal server error', async () => {
      jest.spyOn(repository.suppliers, 'delete').mockRejectedValue(errorUnknow);
      const result = await request(app.getHttpServer())
        .delete(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(500);
      expect(result.serverError).toEqual(true);
    });

    it('/suppliers/:id (DELETE) - throw Error badRequest', async () => {
      jest.spyOn(repository.suppliers, 'delete').mockRejectedValue(errorKnow);
      const result = await request(app.getHttpServer())
        .delete(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(400);
      expect(result.body.message).toEqual('Error badRequest');
    });

    it('/suppliers/:id (DELETE) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .delete(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${fakeToken}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/suppliers/:id (DELETE) - throw Unauthorized (empty Auhorization)', async () => {
      const result = await request(app.getHttpServer()).delete(
        `/suppliers/${suppliersId}`,
      );
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/suppliers/:id (DELETE)', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
    });
  });
});
