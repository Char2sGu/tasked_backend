import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import './crud-typeorm.patch';

export function useGlobalComponents(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useGlobalComponents(app);
  await app.listen(3000);
}
bootstrap();
