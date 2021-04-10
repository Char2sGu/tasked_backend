import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './crud-typeorm.patch';

export function useGlobalComponents(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useGlobalComponents(app);
  await app.listen(3000);
}
bootstrap();
