import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker/locale/en';
import { AppModule } from './../src/app.module';

describe('AuthController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
        .send({
          fullName: faker.person.fullName(),
          email: faker.internet.exampleEmail(),
          password: faker.internet.password(),
        });

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
      const mockDataForLogin = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockDataForLogin,
          fullName: faker.person.fullName(),
        });

      const resp = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockDataForLogin);

      expect(resp.status).toBe(200);
    });

    it('should throw 401 error', async () => {
      const mockDataForLogin = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockDataForLogin,
          fullName: faker.person.fullName(),
        });

      const resp = await request(app.getHttpServer()).post('/auth/login').send({
        email: mockDataForLogin.email,
        password: faker.internet.password(),
      });

      expect(resp.status).toBe(401);
    });

    it('should throw 400 error', async () => {
      const resp = await request(app.getHttpServer())
        .post('/auth/login')
        .send({});

      expect(resp.status).toBe(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
