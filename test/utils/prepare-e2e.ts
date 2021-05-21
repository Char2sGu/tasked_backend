import { TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

export async function prepareE2E(module: TestingModule) {
  const app = module.createNestApplication();
  await app.init();
  const requester = supertest(app.getHttpServer());
  return { app, requester };
}
