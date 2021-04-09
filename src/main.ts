import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
  const app = await NestFactory.create(AppModule);
  useGlobalComponents(app);
  await app.listen(3000);
}
bootstrap();
