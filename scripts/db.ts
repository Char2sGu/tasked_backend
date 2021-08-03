import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/sqlite';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import path from 'path';
import { AppModule } from '../src/app.module';

main();

async function main() {
  const action = process.argv[2] as 'reset' | 'populate';
  const args = process.argv.slice(3);
  const app = await NestFactory.create(AppModule, { logger: false });
  if (action == 'reset') await reset(app, ...args);
  else if (action == 'populate') await populate(app, ...args);
  await app.close();
}

async function reset(app: INestApplication, ...[]: string[]) {
  const schemaGenerator = app.get(MikroORM).getSchemaGenerator();
  await schemaGenerator.execute(await schemaGenerator.generate());
}

async function populate(
  app: INestApplication,
  ...[moduleRelativePath]: string[]
) {
  const modulePath = path.join(process.cwd(), moduleRelativePath);
  const em = app.get(EntityManager);
  const entities = (await import(modulePath)).default(em);
  await em.persist(entities).flush();
}
