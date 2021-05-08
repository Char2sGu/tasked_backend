import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import supertest from 'supertest';

export async function prepareE2E(module: TestingModule) {
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  await app.init();
  const requester = supertest(app.getHttpServer());
  return { app, requester };
}
