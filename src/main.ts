import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DB_PATH: string;
      SECRET_KEY: string;
      TOKEN_EXPIRY: string;
    }
  }
}

export function useGlobalComponents(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
}

async function bootstrap() {
  config();

  const { AppModule } = await import('./app.module');

  const app = await NestFactory.create(AppModule);
  useGlobalComponents(app);
  await app.listen(3000);
}
bootstrap();
