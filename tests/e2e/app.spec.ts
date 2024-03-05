import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('testing (e2e)', () => {
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
;});
