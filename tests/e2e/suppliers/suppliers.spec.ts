import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe("Testing Suppliers", () => {
    let suppliersId : string;
    let uuid : string = uuidv4();
    let app: INestApplication;
    let token : string;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        const result = await request(app.getHttpServer()).post("/users/signin").send({email:"admin@admin.fr",password:"Admin@123"});
        token = result.body.access_token;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("/suppliers (GET)", async () => {
      const result = await request(app.getHttpServer())
      .get("/suppliers")
      .set("Authorization",`Bearer ${token}`)

      expect(result.status).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
      
    });

    it("/suppliers (POST)", async () => {  
      const result = await request(app.getHttpServer())
      .post("/suppliers")
      .set("Authorization",`Bearer ${token}`)
      .send({raisonSocial:`e2e test - ${uuid}`})
      expect(result.status).toEqual(201);
      expect(result.body).toHaveProperty("suppliersId")
      expect(result.body).toHaveProperty("raisonSocial",`e2e test - ${uuid}`)
      suppliersId = result.body.suppliersId;
    });

    it("/suppliers (POST) - throw error", async () => {  
      const result = await request(app.getHttpServer())
      .post("/suppliers")
      .set("Authorization",`Bearer ${token}`)
      .send({name:`e2e test - ${uuid}`})
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual("supplier already exist");
    });

    it("/suppliers/:id (GET)", async () => {
      const result = await request(app.getHttpServer())
      .get(`/suppliers/${suppliersId}`)
      .set("Authorization",`Bearer ${token}`)
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty("suppliersId");
      expect(result.body).toHaveProperty("raisonSocial",`e2e test - ${uuid}`)
    });

    it("/suppliers/:id (GET) - throw error", async () => {
      const idSupplierFake = "123456789123456789123456"
      const result = await request(app.getHttpServer())
      .get(`/suppliers/${idSupplierFake}`)
      .set("Authorization",`Bearer ${token}`)
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(`SupplierId : ${idSupplierFake} not found`);
    });

    it("/suppliers/:id (PUT)", async () => {
      const result = await request(app.getHttpServer())
      .put(`/suppliers/${suppliersId}`)
      .set("Authorization",`Bearer ${token}`)
      .send({raisonSocial:"e2e test update"})
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty("suppliersId");
      expect(result.body).toHaveProperty("raisonSocial","e2e test update")
    });

    it("/suppliers/:id (DELETE)", async () => {
      const result = await request(app.getHttpServer())
      .delete(`/suppliers/${suppliersId}`)
      .set("Authorization",`Bearer ${token}`)
      expect(result.status).toEqual(200);
    });
  });