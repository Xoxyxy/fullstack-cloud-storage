import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { mockDataForSuccessLogin } from './mock/auth.mock';

describe('UsersController (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/users/me (GET)', () => {
    it('should return a user info', async () => {
      const loginResp = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockDataForSuccessLogin);

      const resp = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${loginResp.body.access_token}`);

      expect(resp.status).toBe(200);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
