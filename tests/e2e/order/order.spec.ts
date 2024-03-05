import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe("Testing Order", () => {
    let orderId : string;
    let uuid : string = uuidv4();
    let userId : string = "65e730281eccd67c6e08e3ad";
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
    it("/order (GET)", async () => {
      const result = await request(app.getHttpServer())
      .get("/order")
      .set("Authorization",`Bearer ${token}`)

      expect(result.status).toEqual(200);
      expect(result.body).toBeInstanceOf(Array);
    });

    it("/order (POST)", async () => {  
      const order = {
        name:`e2e test - ${uuid}`,
        authorId:userId,
        productsId:[],
        usersId:[],
        address:{
          name_address:"test name address",
          street:"test",
          city:"test",
          zip:"59000",
        }
      }
      const result = await request(app.getHttpServer())
      .post("/order")
      .set("Authorization",`Bearer ${token}`)
      .send(order)
      expect(result.status).toEqual(201);
      expect(result.body).toHaveProperty("orderId")
      expect(result.body).toHaveProperty("name",`e2e test - ${uuid}`)
      orderId = result.body.orderId;
    });

    it("/order (POST) - throw error", async () => {  
      const order = {
        name:`e2e test - ${uuid}`,
        authorId:userId,
        productsId:[],
        usersId:[],
        address:{
          name_address:"test name address",
          street:"test",
          city:"test",
          zip:"59000",
        }
      }
      const result = await request(app.getHttpServer())
      .post("/order")
      .set("Authorization",`Bearer ${token}`)
      .send(order)
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual("order name already exist");
    });

    it("/order/:id (GET)", async () => {
      const result = await request(app.getHttpServer())
      .get(`/order/${orderId}`)
      .set("Authorization",`Bearer ${token}`)
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty("orderId");
      expect(result.body).toHaveProperty("name",`e2e test - ${uuid}`)
    });

    it("/order/:id (GET) - throw error", async () => {
      const idOrderFake = "123456789123456789123456"
      const result = await request(app.getHttpServer())
      .get(`/order/${idOrderFake}`)
      .set("Authorization",`Bearer ${token}`)
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(`OrderId : ${idOrderFake} not found`);
    });

    it("/order/:id (PUT)", async () => {
      const order = {
        name:"e2e test update",
        productsId:[],
        usersId:[]
      }
      const result = await request(app.getHttpServer())
      .put(`/order/${orderId}`)
      .set("Authorization",`Bearer ${token}`)
      .send(order)
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty("orderId");
      expect(result.body).toHaveProperty("name","e2e test update")
    });

    it("/order/:id (DELETE)", async () => {
      const result = await request(app.getHttpServer())
      .delete(`/order/${orderId}`)
      .set("Authorization",`Bearer ${token}`)
      expect(result.status).toEqual(200);
      expect(result.text).toEqual("Le devis à été supprimé")
    });
  });