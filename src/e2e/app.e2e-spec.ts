import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

describe('testing (e2e)', () => {
  let app: INestApplication;
  let token: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const result = await request(app.getHttpServer())
      .post('/users/signin')
      .send({ email: 'admin@admin.fr', password: 'admin' });
    token = result.body.access_token;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AppController', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('productController', () => {
    let idProduct: string;
    const uuid: string = uuidv4();
    it('/products (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBeGreaterThan(0);
    });

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

    it('/products/:id (PUT)', async () => {
      const result = await request(app.getHttpServer())
        .put(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'e2e test update', comment: 'e2e test commentaire' });
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('productId');
      expect(result.body).toHaveProperty('name', 'e2e test update');
    });

    it('/products/:id (DELETE)', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/products/${idProduct}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
    });
  });

  describe('suppliersController', () => {
    let suppliersId: string;
    const uuid: string = uuidv4();
    it('/suppliers (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get('/suppliers')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body.length).toBeGreaterThan(0);
    });

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
        .send({ name: `e2e test - ${uuid}` });
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('supplier already exist');
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

    it('/suppliers/:id (PUT)', async () => {
      const result = await request(app.getHttpServer())
        .put(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ raisonSocial: 'e2e test update' });
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('suppliersId');
      expect(result.body).toHaveProperty('raisonSocial', 'e2e test update');
    });

    it('/suppliers/:id (DELETE)', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/suppliers/${suppliersId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
    });
  });

  describe('usersController', () => {
    let userId: string;

    it('/users/signup (POST)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `test`,
        firstname: `test`,
        lastname: `test`,
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
        password: `test`,
        firstname: `test`,
        lastname: `test`,
      };
      const result = await request(app.getHttpServer())
        .post('/users/signup')
        .send(user);
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual(
        'Erreur lors du hashage du password test',
      );
    });

    it('/users/signup (POST) - throw error (exist)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `test`,
        firstname: `test`,
        lastname: `test`,
      };
      const result = await request(app.getHttpServer())
        .post('/users/signup')
        .send(user);
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('User already exist');
    });

    it('/users/signin (POST)', async () => {
      const user = {
        email: `test@test.fr`,
        password: `test`,
      };
      const result = await request(app.getHttpServer())
        .post('/users/signin')
        .send(user);
      expect(result.status).toEqual(201);
      expect(result.body).toHaveProperty('user');
      expect(result.body).toHaveProperty('access_token');
    });

    it('/users/signin (POST) - throw error (user not found)', async () => {
      const user = {
        email: `test@test3.fr`,
        password: `test`,
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
        password: `test3`,
      };
      const result = await request(app.getHttpServer())
        .post('/users/signin')
        .send(user);
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual('Le mot de passe est incorrect');
    });

    it('/users/getProfil/:id (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get(`/users/getProfil/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('userId');
    });

    it('/users/getProfil/:id (GET) - throw error', async () => {
      const idUserFake = '123456789123456789123456';
      const result = await request(app.getHttpServer())
        .get(`/users/getProfil/${idUserFake}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(`UserId : ${idUserFake} not found`);
    });

    it('/users/password/:id (PUT)', async () => {
      const updatepassword = {
        oldPassword: `test`,
        newPassword: `test_1`,
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
        newPassword: `test_1`,
      };
      const result = await request(app.getHttpServer())
        .put(`/users/password/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatepassword);
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual('Le mot de passe est incorrect');
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

    it('/users/:id (DELETE)', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.text).toEqual("L'utilisateur a été supprimé");
    });
  });

  describe('ordersController', () => {
    let orderId: string;
    const uuid: string = uuidv4();
    const productId = '6559d6c5118a401fc8456f28';
    const userId = '64fb564f5b052ea8b128e96d';

    it('/order (GET)', async () => {
      const result = await request(app.getHttpServer())
        .get('/order')
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
    });

    it('/order (POST)', async () => {
      const order = {
        name: `e2e test - ${uuid}`,
        authorId: userId,
        productsId: [productId],
        usersId: [userId],
        address: {
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
        productsId: [productId],
        usersId: [userId],
        address: {
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

    it('/order/:id (PUT)', async () => {
      const order = {
        name: 'e2e test update',
        productsId: [productId],
        usersId: [userId],
      };
      const result = await request(app.getHttpServer())
        .put(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty('orderId');
      expect(result.body).toHaveProperty('name', 'e2e test update');
    });

    it('/order/:id (DELETE)', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/order/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.text).toEqual('Le devis à été supprimé');
    });
  });
});
