import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { RepositoriesService } from '@/repositories/repositories.service';

describe('testing products', () => {
  let app: INestApplication;
  let token: string;
  let idProduct: string;
  const uuid: string = uuidv4();
  let repository: RepositoriesService;
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

  describe('create product', () => {
    it('/products (POST)', async () => {
      const result = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `e2e test - ${uuid}` });
      expect(result.status).toEqual(201);
      expect(result.body).toHaveProperty('productId');
      expect(result.body).toHaveProperty('name', `e2e test - ${uuid}`);
      idProduct = result.body.productId;
    });

    it('/products (POST) - throw error', async () => {
      const result = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `e2e test - ${uuid}` });
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('product already exist');
    });

    it('/products (POST) - throw internal server error (findFirst)', async () => {
      jest
        .spyOn(repository.products, 'findFirst')
        .mockRejectedValue(new Error('internal server error'));
      const result = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `e2e test - ${uuid}` });
      expect(result.status).toEqual(500);
      expect(result.body.message).toEqual('internal server error');
    });

    it('/products (POST) - throw internal server error (create)', async () => {
      jest
        .spyOn(repository.products, 'create')
        .mockRejectedValue(new Error('internal server error'));
      const result = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `e2e test - ${uuid}-internal-server-error` });
      expect(result.status).toEqual(500);
      expect(result.body.message).toEqual('internal server error');
    });

    it('/products (POST) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ name: `e2e test - ${uuid}` });
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/products (POST) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer())
        .post('/products')
        .send({ name: `e2e test - ${uuid}` });
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('find products', () => {
    it('/products (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
    });

    it('/products (GET) - throw internal server error', async () => {
      jest
        .spyOn(repository.products, 'findMany')
        .mockRejectedValue(new Error('internal server error'));
      const result = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(500);
      expect(result.body.message).toEqual('internal server error');
    });

    it('/products (GET) - throw Unauthorized (fake token)', async () => {
      const faketoken = 'fake_token';
      const result = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${faketoken}`);

      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/products (GET) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer()).get('/products');

      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/products/:id (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('productId');
      expect(result.body).toHaveProperty('name', `e2e test - ${uuid}`);
    });

    it('/products/:id (GET) - throw error', async () => {
      const idProductFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .get(`/products/${idProductFake}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(
        `ProductId : ${idProductFake} not found`,
      );
    });

    it('/products/:id (GET) - throw internal server error', async () => {
      jest
        .spyOn(repository.products, 'findUnique')
        .mockRejectedValue(new Error('internal server error'));
      const result = await request(app.getHttpServer())
        .get(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(500);
      expect(result.body.message).toEqual('internal server error');
    });

    it('/products/:id (GET) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .get(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${fakeToken}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/products/:id (GET) - throw Unauthorized (empty authorization)', async () => {
      const result = await request(app.getHttpServer()).get(
        `/products/${idProduct}`,
      );
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('update product', () => {
    it('/products/:id (PUT)', async () => {
      const result = await request(app.getHttpServer())
        .put(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'e2e test update', comment: 'e2e test commentaire' });
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('productId');
      expect(result.body).toHaveProperty('name', 'e2e test update');
    });

    it('/products/:id (PUT) - throw error not found', async () => {
      const idProductFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .put(`/products/${idProductFake}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'e2e test update', comment: 'e2e test commentaire' });
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(
        `ProductId : ${idProductFake} not found`,
      );
    });

    it('/products/:id (PUT) - throw internal server error', async () => {
      jest
        .spyOn(repository.products, 'update')
        .mockRejectedValue(new Error('internal server error'));
      const result = await request(app.getHttpServer())
        .put(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'e2e test update', comment: 'e2e test commentaire' });
      expect(result.status).toEqual(500);
      expect(result.body.message).toEqual('internal server error');
    });

    it('/products/:id (PUT) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .put(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ name: 'e2e test update', comment: 'e2e test commentaire' });
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/products/:id (PUT) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer())
        .put(`/products/${idProduct}`)
        .send({ name: 'e2e test update', comment: 'e2e test commentaire' });
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });
  });

  describe('delete product', () => {
    it('/products/:id (DELETE) - throw internal server error', async () => {
      jest
        .spyOn(repository.products, 'delete')
        .mockRejectedValue(new Error('internal server error'));
      const result = await request(app.getHttpServer())
        .delete(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(500);
      expect(result.body.message).toEqual('internal server error');
    });

    it('/products/:id (DELETE) - throw Unauthorized (fake token)', async () => {
      const fakeToken = 'fake_token';
      const result = await request(app.getHttpServer())
        .delete(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${fakeToken}`);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/products/:id (DELETE) - throw Unauthorized (empty Authorization)', async () => {
      const result = await request(app.getHttpServer()).delete(
        `/products/${idProduct}`,
      );
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Unauthorized');
    });

    it('/products/:id (DELETE)', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
    });
  });
});
