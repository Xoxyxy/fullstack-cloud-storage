import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker/locale/en';
import { AppModule } from './../src/app.module';

describe('UsersController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/users/me (GET)', () => {
    it('should return a user info', async () => {
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

      const loginResp = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockDataForLogin);

      const resp = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${loginResp.body.access_token}`);

      expect(resp.status).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
