import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import * as bcrypt from 'bcrypt';

describe("Testing Users", () => {
    let userId : string;
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

  describe("AppController", () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });
    it("/users/signup (POST)", async () => {
      const user = {
        email:`test@test.fr`,	
        password:`Test@123`,
        firstname:`test`,
        lastname:`test`,
      }
      const result = await request(app.getHttpServer())
      .post("/users/signup")
      .send(user)
      expect(result.status).toEqual(201);
      expect(result.body).toHaveProperty("userId");
      expect(result.body).toHaveProperty("email",user.email);
      userId = result.body.userId;
    });

    it("/users/signup (POST) - throw error (hashage)", async () => {
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('test' as never);
      jest.spyOn(bcrypt, 'hash').mockRejectedValue('test' as never);

      const user = {
        email:`test@test2.fr`,	
        password:`Test@123`,
        firstname:`test`,
        lastname:`test`,
      }
      const result = await request(app.getHttpServer())
      .post("/users/signup")
      .send(user)
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual("Erreur lors du hashage du password test");
    });

    it("/users/signup (POST) - throw error (exist)", async () => {
      const user = {
        email:`test@test.fr`,	
        password:`Test@123`,
        firstname:`test`,
        lastname:`test`,
      }
      const result = await request(app.getHttpServer())
      .post("/users/signup")
      .send(user)
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual("User already exist");
    });

    it("/users/signin (POST)", async () => {
      const user = {
        email:`test@test.fr`,	
        password:`Test@123`
      }
      const result = await request(app.getHttpServer())
      .post("/users/signin")
      .send(user)
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty("access_token");
    });

    it("/users/signin (POST) - throw error (user not found)", async () => {
      const user = {
        email:`test@test3.fr`,	
        password:`Test@123`
      }
      const result = await request(app.getHttpServer())
      .post("/users/signin")
      .send(user)
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual("User not found");
    });

    it("/users/signin (POST) - throw error (password incorrect)", async () => {
      const user = {
        email:`test@test.fr`,	
        password:`Test@1234`
      }
      const result = await request(app.getHttpServer())
      .post("/users/signin")
      .send(user)
      expect(result.status).toEqual(401);
      expect(result.body.message).toEqual("Le mot de passe est incorrect");
    });

    it("/users/getProfil/:id (GET)", async () => {
      const result = await request(app.getHttpServer())
      .get(`/users/getProfil/${userId}`)
      .set("Authorization",`Bearer ${token}`)

      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty("userId");
    });

    it("/users/getProfil/:id (GET) - throw error", async () => {
      const idUserFake = "123456789123456789123456"
      const result = await request(app.getHttpServer())
      .get(`/users/getProfil/${idUserFake}`)
      .set("Authorization",`Bearer ${token}`)
      expect(result.status).toEqual(404);
      expect(result.body.message).toEqual(`UserId : ${idUserFake} not found`);
    });

    it('/users/password/:id (PUT)', async () => {
        const updatepassword = {
          oldPassword:`Test@123`,
          newPassword:`Test@456`
        }
        const result = await request(app.getHttpServer())
        .put(`/users/password/${userId}`)
        .set("Authorization",`Bearer ${token}`)
        .send(updatepassword)
        expect(result.status).toEqual(200);
        expect(result.text).toEqual("Le mot de passe a été modifié");
    });

    it('/users/password/:id (PUT) - throw error (password incorrect)', async () => {
      const updatepassword = {
        oldPassword:`test_2`,
        newPassword:`Test@456`
      }
      const result = await request(app.getHttpServer())
      .put(`/users/password/${userId}`)
      .set("Authorization",`Bearer ${token}`)
      .send(updatepassword)
      expect(result.status).toEqual(409);
      expect(result.body.message).toEqual("Le mot de passe est incorrect");
    });

    it("/users/:id (PUT)", async () => {
      const user = {
        email:"test@test.fr",
        firstname:"test_1",
        lastname:"test_1"
      }
      const result = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set("Authorization",`Bearer ${token}`)
      .send(user)
      expect(result.status).toEqual(200);
      expect(result.body).toHaveProperty("userId");
      expect(result.body).toHaveProperty("email",user.email);
      expect(result.body).toHaveProperty("firstname",user.firstname);
      expect(result.body).toHaveProperty("lastname",user.lastname);
  });

    it("/users/:id (DELETE)", async () => {
      const result = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set("Authorization",`Bearer ${token}`)
      expect(result.status).toEqual(200);
      expect(result.text).toEqual("L'utilisateur a été supprimé");
    });
  
  })