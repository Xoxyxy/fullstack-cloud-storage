import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  mockDataForSuccessRegister,
  mockDataForSuccessLogin,
  mockDataForFailLogin,
} from './mock/auth.mock';

describe('AuthController (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('should register', async () => {
      const resp = await request(app.getHttpServer())
        .post('/auth/register')
        .send(mockDataForSuccessRegister);

      expect(resp.status).toBe(201);
    });

    it('should throw an error', async () => {
      const resp = await request(app.getHttpServer())
        .post('/auth/register')
        .send({});

      expect(resp.status).toBe(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return a token', async () => {
      const resp = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockDataForSuccessLogin);

      expect(resp.status).toBe(200);
    });

    it('should throw 401 error', async () => {
      const resp = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockDataForFailLogin);

      expect(resp.status).toBe(401);
    });

    it('should throw 400 error', async () => {
      const resp = await request(app.getHttpServer())
        .post('/auth/login')
        .send({});

      expect(resp.status).toBe(400);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
